import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateRecipeInput, UpdateRecipeInput, RecipeFilters } from './dto/recipe.dto';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class RecipesService {
  constructor(
  private prisma: PrismaService,
  private realtimeService: RealtimeService,
) {}
  async createRecipe(data: CreateRecipeInput, authorId: string) {
    const { ingredients, instructions, ...recipeData } = data;

    return this.prisma.recipe.create({
      data: {
        ...recipeData,
        authorId,
        ingredients: {
          create: ingredients,
        },
        instructions: {
          create: instructions,
        },
      },
      include: this.getRecipeIncludes(),
    });
  }

  async findAllRecipes(filters?: RecipeFilters, skip = 0, take = 20) {
    const where: any = {};

    if (filters) {
      if (filters.cuisine) where.cuisine = filters.cuisine;
      if (filters.difficulty) where.difficulty = filters.difficulty;
      if (filters.maxCookingTime) where.cookingTime = { lte: filters.maxCookingTime };
      
      if (filters.ingredients && filters.ingredients.length > 0) {
        where.ingredients = {
          some: {
            name: {
              in: filters.ingredients,
              mode: 'insensitive',
            },
          },
        };
      }
    }

    const recipes = await this.prisma.recipe.findMany({
      where,
      skip,
      take,
      include: this.getRecipeIncludes(),
      orderBy: { createdAt: 'desc' },
    });

    return recipes.map(recipe => this.calculateRecipeStats(recipe));
  }

  async findRecipeById(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: this.getRecipeIncludes(),
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return this.calculateRecipeStats(recipe);
  }

  async updateRecipe(id: string, data: UpdateRecipeInput, userId: string) {
    const recipe = await this.findRecipeById(id);
    
    if (recipe.author.id !== userId) {
      throw new ForbiddenException('You can only update your own recipes');
    }

    const updated = await this.prisma.recipe.update({
      where: { id },
      data,
      include: this.getRecipeIncludes(),
    });

    return this.calculateRecipeStats(updated);
  }

  async deleteRecipe(id: string, userId: string) {
    const recipe = await this.findRecipeById(id);
    
    if (recipe.author.id !== userId) {
      throw new ForbiddenException('You can only delete your own recipes');
    }

    await this.prisma.recipe.delete({
      where: { id },
    });

    return { success: true };
  }

  async rateRecipe(recipeId: string, userId: string, value: number) {
    const rating = await this.prisma.rating.upsert({
        where: {
        userId_recipeId: {
            userId,
            recipeId,
        },
        },
        update: { value },
        create: {
        value,
        userId,
        recipeId,
        },
        include: {
        user: true,
        },
    });

    // Send real-time notification
    await this.realtimeService.notifyNewRating(recipeId, rating);

    return rating;
  }

  async commentOnRecipe(recipeId: string, userId: string, content: string) {
    const comment = await this.prisma.comment.create({
        data: {
        content,
        userId,
        recipeId,
        },
        include: {
        user: true,
        },
    });

    // Send real-time notification
    await this.realtimeService.notifyNewComment(recipeId, comment);

    return comment;
  }

  async getUserFeed(userId: string, skip = 0, take = 20) {
    const following = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map(f => f.followingId);

    const recipes = await this.prisma.recipe.findMany({
      where: {
        authorId: { in: followingIds },
      },
      skip,
      take,
      include: this.getRecipeIncludes(),
      orderBy: { createdAt: 'desc' },
    });

    return recipes.map(recipe => this.calculateRecipeStats(recipe));
  }

  private getRecipeIncludes() {
    return {
      author: true,
      ingredients: true,
      instructions: {
        orderBy: { step: 'asc' as const},
      },
      ratings: {
        include: { user: true },
      },
      comments: {
        include: { user: true },
        orderBy: { createdAt: 'desc' as const },
      },
    };
  }

  private calculateRecipeStats(recipe: any) {
    const totalRatings = recipe.ratings.length;
    const averageRating = totalRatings > 0 
      ? recipe.ratings.reduce((sum: number, rating: any) => sum + rating.value, 0) / totalRatings 
      : 0;

    return {
      ...recipe,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings,
    };
  }
}