import { Resolver, Query, Args, ObjectType, Field } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from './ai.service';
import { RecipesService } from '../recipes/recipes.service';

@ObjectType()
export class IngredientSubstitution {
  @Field()
  substitute: string;

  @Field()
  notes: string;
}

@ObjectType()
export class RecipePairings {
  @Field(() => [String])
  wines: string[];

  @Field(() => [String])
  sides: string[];
}

@Resolver()
export class AiResolver {
  constructor(
    private aiService: AiService,
    private recipesService: RecipesService,
  ) {}

  @Query(() => [String])
  @UseGuards(JwtAuthGuard)
  async getRecipeImprovements(@Args('recipeId') recipeId: string) {
    const recipe = await this.recipesService.findRecipeById(recipeId);
    return this.aiService.generateRecipeImprovements(recipe);
  }

  @Query(() => [IngredientSubstitution])
  async getIngredientSubstitutions(
    @Args('ingredient') ingredient: string,
    @Args('dietaryRestrictions', { type: () => [String], nullable: true }) 
    dietaryRestrictions?: string[],
  ) {
    return this.aiService.suggestIngredientSubstitutions(ingredient, dietaryRestrictions);
  }

  @Query(() => [String])
  @UseGuards(JwtAuthGuard)
  async getCookingTips(@Args('recipeId') recipeId: string) {
    const recipe = await this.recipesService.findRecipeById(recipeId);
    return this.aiService.generateCookingTips(recipe);
  }

  @Query(() => RecipePairings)
  @UseGuards(JwtAuthGuard)
  async getRecipePairings(@Args('recipeId') recipeId: string) {
    const recipe = await this.recipesService.findRecipeById(recipeId);
    return this.aiService.suggestPairings(recipe);
  }
}