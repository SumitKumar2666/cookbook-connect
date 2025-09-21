import { Resolver, Query, Mutation, Args, Context, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RecipesService } from './recipes.service';
import { Recipe, CreateRecipeInput, UpdateRecipeInput, RecipeFilters, Rating, Comment } from './dto/recipe.dto';

@Resolver(() => Recipe)
export class RecipesResolver {
  constructor(private recipesService: RecipesService) {}

  @Mutation(() => Recipe)
  @UseGuards(JwtAuthGuard)
  async createRecipe(
    @Args('input') input: CreateRecipeInput,
    @Context() context: any,
  ) {
    return this.recipesService.createRecipe(input, context.req.user.id);
  }

  @Query(() => [Recipe])
  async recipes(
    @Args('filters', { nullable: true }) filters?: RecipeFilters,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip?: number,
    @Args('take', { type: () => Int, defaultValue: 20 }) take?: number,
  ) {
    return this.recipesService.findAllRecipes(filters, skip, take);
  }

  @Query(() => Recipe)
  async recipe(@Args('id') id: string) {
    return this.recipesService.findRecipeById(id);
  }

  @Mutation(() => Recipe)
  @UseGuards(JwtAuthGuard)
  async updateRecipe(
    @Args('id') id: string,
    @Args('input') input: UpdateRecipeInput,
    @Context() context: any,
  ) {
    return this.recipesService.updateRecipe(id, input, context.req.user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteRecipe(
    @Args('id') id: string,
    @Context() context: any,
  ) {
    const result = await this.recipesService.deleteRecipe(id, context.req.user.id);
    return result.success;
  }

  @Mutation(() => Rating)
  @UseGuards(JwtAuthGuard)
  async rateRecipe(
    @Args('recipeId') recipeId: string,
    @Args('value', { type: () => Int }) value: number,
    @Context() context: any,
  ) {
    return this.recipesService.rateRecipe(recipeId, context.req.user.id, value);
  }

  @Mutation(() => Comment)
  @UseGuards(JwtAuthGuard)
  async commentOnRecipe(
    @Args('recipeId') recipeId: string,
    @Args('content') content: string,
    @Context() context: any,
  ) {
    return this.recipesService.commentOnRecipe(recipeId, context.req.user.id, content);
  }

  @Query(() => [Recipe])
  @UseGuards(JwtAuthGuard)
  async userFeed(
    @Context() context: any,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip?: number,
    @Args('take', { type: () => Int, defaultValue: 20 }) take?: number,
  ) {
    return this.recipesService.getUserFeed(context.req.user.id, skip, take);
  }
}