import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, estypes } from '@elastic/elasticsearch';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';

interface IngredientAggs {
  ingredients: {
    ingredient_names: {
      buckets: { key: string; doc_count: number }[];
    };
  };
}

@Injectable()
export class SearchService implements OnModuleInit {
  private esClient: Client;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.esClient = new Client({
      node: this.configService.get<string>('ELASTICSEARCH_URL'),
    });
  }

  async onModuleInit() {
    await this.createRecipeIndex();
    await this.indexAllRecipes();
  }

  private async createRecipeIndex() {
    const indexExists = await this.esClient.indices.exists({
      index: 'recipes',
    });

    if (!indexExists) {
      await this.esClient.indices.create({
        index: 'recipes',
          mappings: {
            properties: {
              id: { type: 'keyword' },
              title: { 
                type: 'text',
                analyzer: 'standard',
                fields: {
                  keyword: { type: 'keyword' }
                }
              },
              description: { type: 'text' },
              cuisine: { type: 'keyword' },
              difficulty: { type: 'keyword' },
              cookingTime: { type: 'integer' },
              servings: { type: 'integer' },
              ingredients: {
                type: 'nested',
                properties: {
                  name: { 
                    type: 'text',
                    analyzer: 'standard',
                    fields: {
                      keyword: { type: 'keyword' }
                    }
                  },
                  quantity: { type: 'text' },
                  unit: { type: 'keyword' }
                }
              },
              author: {
                properties: {
                  id: { type: 'keyword' },
                  username: { type: 'keyword' },
                  firstName: { type: 'text' },
                  lastName: { type: 'text' }
                }
              },
              averageRating: { type: 'float' },
              totalRatings: { type: 'integer' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' }
            }
          }
      });
    }
  }

  async indexRecipe(recipeId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        author: true,
        ingredients: true,
        ratings: true,
      },
    });

    if (!recipe) return;

    const totalRatings = recipe.ratings.length;
    const averageRating = totalRatings > 0 
      ? recipe.ratings.reduce((sum, rating) => sum + rating.value, 0) / totalRatings 
      : 0;

    await this.esClient.index({
      index: 'recipes',
      id: recipe.id,
      body: {
        title: recipe.title,
        description: recipe.description,
        cuisine: recipe.cuisine,
        difficulty: recipe.difficulty,
        cookingTime: recipe.cookingTime,
        servings: recipe.servings,
        ingredients: recipe.ingredients.map(ing => ({
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
        })),
        author: {
          id: recipe.author.id,
          username: recipe.author.username,
          firstName: recipe.author.firstName,
          lastName: recipe.author.lastName,
        },
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings,
        createdAt: recipe.createdAt,
        updatedAt: recipe.updatedAt,
      },
    });
  }

  private async indexAllRecipes() {
    const recipes = await this.prisma.recipe.findMany({
      include: {
        author: true,
        ingredients: true,
        ratings: true,
      },
    });

    for (const recipe of recipes) {
      await this.indexRecipe(recipe.id);
    }
  }

  async searchRecipes(query?: string, filters: any = {}, skip = 0, take = 20) {
    const must: any[] = [];
    const filter: any[] = [];

    // Text search
    if (query) {
      must.push({
        multi_match: {
          query,
          fields: [
            'title^3',
            'description^2',
            'ingredients.name^2',
            'author.username',
            'author.firstName',
            'author.lastName'
          ],
          type: 'best_fields',
          fuzziness: 'AUTO',
        },
      });
    } else {
      must.push({ match_all: {} });
    }

    // Filters
    if (filters.cuisine) {
      filter.push({ term: { cuisine: filters.cuisine } });
    }
    if (filters.difficulty) {
      filter.push({ term: { difficulty: filters.difficulty } });
    }
    if (filters.maxCookingTime) {
      filter.push({ range: { cookingTime: { lte: filters.maxCookingTime } } });
    }
    if (filters.minRating) {
      filter.push({ range: { averageRating: { gte: filters.minRating } } });
    }

    // Ingredient-based search
    if (filters.ingredients && filters.ingredients.length > 0) {
      const ingredientQueries = filters.ingredients.map((ingredient: string) => ({
        nested: {
          path: 'ingredients',
          query: {
            match: {
              'ingredients.name': {
                query: ingredient,
                fuzziness: 'AUTO',
              },
            },
          },
        },
      }));

      must.push({
        bool: {
          should: ingredientQueries,
          minimum_should_match: Math.ceil(filters.ingredients.length * 0.6), // Match at least 60% of ingredients
        },
      });
    }

    const response = await this.esClient.search({
      index: 'recipes',
      from: skip,
      size: take,
      query: {
        bool: {
          must,
          filter,
        },
      },
      sort: [
        { _score: { order: 'desc' } },
        { averageRating: { order: 'desc' } },
        { totalRatings: { order: 'desc' } },
        { createdAt: { order: 'desc' } },
      ],
    });

    return {
      recipes: response.hits.hits.map((hit: any) => hit._source),
      total: typeof response.hits.total === 'number'
                ? response.hits.total
                : response.hits.total?.value,
    };
  }

  async getIngredientSuggestions(query: string, limit = 10) {
    const response = await this.esClient.search<unknown, IngredientAggs>({
      index: 'recipes',
        size: 0,
        aggs: {
          ingredients: {
            nested: {
              path: 'ingredients',
            },
            aggs: {
              ingredient_names: {
                terms: {
                  field: 'ingredients.name.keyword',
                  include: `.*${query}.*`,
                  size: limit,
                },
              },
            },
          },
        },
    });

    return response.aggregations?.ingredients.ingredient_names.buckets.map(
      (bucket: any) => bucket.key,
    );
  }

  async cookWithWhatIHave(availableIngredients: string[], limit = 20) {
    return this.searchRecipes('', { ingredients: availableIngredients }, 0, limit);
  }
}