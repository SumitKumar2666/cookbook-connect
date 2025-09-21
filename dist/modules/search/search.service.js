"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const elasticsearch_1 = require("@elastic/elasticsearch");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let SearchService = class SearchService {
    configService;
    prisma;
    esClient;
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.esClient = new elasticsearch_1.Client({
            node: this.configService.get('ELASTICSEARCH_URL'),
        });
    }
    async onModuleInit() {
        await this.createRecipeIndex();
        await this.indexAllRecipes();
    }
    async createRecipeIndex() {
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
    async indexRecipe(recipeId) {
        const recipe = await this.prisma.recipe.findUnique({
            where: { id: recipeId },
            include: {
                author: true,
                ingredients: true,
                ratings: true,
            },
        });
        if (!recipe)
            return;
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
    async indexAllRecipes() {
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
    async searchRecipes(query, filters = {}, skip = 0, take = 20) {
        const must = [];
        const filter = [];
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
        }
        else {
            must.push({ match_all: {} });
        }
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
        if (filters.ingredients && filters.ingredients.length > 0) {
            const ingredientQueries = filters.ingredients.map((ingredient) => ({
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
                    minimum_should_match: Math.ceil(filters.ingredients.length * 0.6),
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
            recipes: response.hits.hits.map((hit) => hit._source),
            total: typeof response.hits.total === 'number'
                ? response.hits.total
                : response.hits.total?.value,
        };
    }
    async getIngredientSuggestions(query, limit = 10) {
        const response = await this.esClient.search({
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
        return response.aggregations?.ingredients.ingredient_names.buckets.map((bucket) => bucket.key);
    }
    async cookWithWhatIHave(availableIngredients, limit = 20) {
        return this.searchRecipes('', { ingredients: availableIngredients }, 0, limit);
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map