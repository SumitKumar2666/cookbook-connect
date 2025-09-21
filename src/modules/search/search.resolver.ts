import { Resolver, Query, Args, Int, ObjectType, Field } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { Recipe, RecipeFilters } from '../recipes/dto/recipe.dto';

@ObjectType()
export class SearchResult {
  @Field(() => [Recipe])
  recipes: Recipe[];

  @Field(() => Int)
  total: number;
}

@Resolver()
export class SearchResolver {
  constructor(private searchService: SearchService) {}

  @Query(() => SearchResult)
  async searchRecipes(
    @Args('query', { nullable: true }) query?: string,
    @Args('filters', { nullable: true }) filters?: RecipeFilters,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip?: number,
    @Args('take', { type: () => Int, defaultValue: 20 }) take?: number,
  ) {
    return this.searchService.searchRecipes(query, filters, skip, take);
  }

  @Query(() => [String])
  async ingredientSuggestions(
    @Args('query') query: string,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit?: number,
  ) {
    return this.searchService.getIngredientSuggestions(query, limit);
  }

  @Query(() => SearchResult)
  async cookWithWhatIHave(
    @Args('ingredients', { type: () => [String] }) ingredients: string[],
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit?: number,
  ) {
    return this.searchService.cookWithWhatIHave(ingredients, limit);
  }
}