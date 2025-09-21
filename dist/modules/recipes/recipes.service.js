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
exports.RecipesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const realtime_service_1 = require("../realtime/realtime.service");
let RecipesService = class RecipesService {
    prisma;
    realtimeService;
    constructor(prisma, realtimeService) {
        this.prisma = prisma;
        this.realtimeService = realtimeService;
    }
    async createRecipe(data, authorId) {
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
    async findAllRecipes(filters, skip = 0, take = 20) {
        const where = {};
        if (filters) {
            if (filters.cuisine)
                where.cuisine = filters.cuisine;
            if (filters.difficulty)
                where.difficulty = filters.difficulty;
            if (filters.maxCookingTime)
                where.cookingTime = { lte: filters.maxCookingTime };
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
    async findRecipeById(id) {
        const recipe = await this.prisma.recipe.findUnique({
            where: { id },
            include: this.getRecipeIncludes(),
        });
        if (!recipe) {
            throw new common_1.NotFoundException('Recipe not found');
        }
        return this.calculateRecipeStats(recipe);
    }
    async updateRecipe(id, data, userId) {
        const recipe = await this.findRecipeById(id);
        if (recipe.author.id !== userId) {
            throw new common_1.ForbiddenException('You can only update your own recipes');
        }
        const updated = await this.prisma.recipe.update({
            where: { id },
            data,
            include: this.getRecipeIncludes(),
        });
        return this.calculateRecipeStats(updated);
    }
    async deleteRecipe(id, userId) {
        const recipe = await this.findRecipeById(id);
        if (recipe.author.id !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own recipes');
        }
        await this.prisma.recipe.delete({
            where: { id },
        });
        return { success: true };
    }
    async rateRecipe(recipeId, userId, value) {
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
        await this.realtimeService.notifyNewRating(recipeId, rating);
        return rating;
    }
    async commentOnRecipe(recipeId, userId, content) {
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
        await this.realtimeService.notifyNewComment(recipeId, comment);
        return comment;
    }
    async getUserFeed(userId, skip = 0, take = 20) {
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
    getRecipeIncludes() {
        return {
            author: true,
            ingredients: true,
            instructions: {
                orderBy: { step: 'asc' },
            },
            ratings: {
                include: { user: true },
            },
            comments: {
                include: { user: true },
                orderBy: { createdAt: 'desc' },
            },
        };
    }
    calculateRecipeStats(recipe) {
        const totalRatings = recipe.ratings.length;
        const averageRating = totalRatings > 0
            ? recipe.ratings.reduce((sum, rating) => sum + rating.value, 0) / totalRatings
            : 0;
        return {
            ...recipe,
            averageRating: Math.round(averageRating * 10) / 10,
            totalRatings,
        };
    }
};
exports.RecipesService = RecipesService;
exports.RecipesService = RecipesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        realtime_service_1.RealtimeService])
], RecipesService);
//# sourceMappingURL=recipes.service.js.map