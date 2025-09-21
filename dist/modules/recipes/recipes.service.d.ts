import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateRecipeInput, UpdateRecipeInput, RecipeFilters } from './dto/recipe.dto';
import { RealtimeService } from '../realtime/realtime.service';
export declare class RecipesService {
    private prisma;
    private realtimeService;
    constructor(prisma: PrismaService, realtimeService: RealtimeService);
    createRecipe(data: CreateRecipeInput, authorId: string): Promise<{
        ratings: ({
            user: {
                id: string;
                email: string;
                username: string;
                firstName: string;
                lastName: string;
                bio: string | null;
                avatar: string | null;
                password: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            value: number;
            recipeId: string;
        })[];
        comments: ({
            user: {
                id: string;
                email: string;
                username: string;
                firstName: string;
                lastName: string;
                bio: string | null;
                avatar: string | null;
                password: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            recipeId: string;
        })[];
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
            bio: string | null;
            avatar: string | null;
            password: string;
            createdAt: Date;
            updatedAt: Date;
        };
        ingredients: {
            id: string;
            name: string;
            quantity: string;
            unit: string | null;
            recipeId: string;
        }[];
        instructions: {
            id: string;
            step: number;
            content: string;
            recipeId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        cuisine: string | null;
        difficulty: string;
        cookingTime: number;
        servings: number;
        imageUrl: string | null;
        authorId: string;
    }>;
    findAllRecipes(filters?: RecipeFilters, skip?: number, take?: number): Promise<any[]>;
    findRecipeById(id: string): Promise<any>;
    updateRecipe(id: string, data: UpdateRecipeInput, userId: string): Promise<any>;
    deleteRecipe(id: string, userId: string): Promise<{
        success: boolean;
    }>;
    rateRecipe(recipeId: string, userId: string, value: number): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
            bio: string | null;
            avatar: string | null;
            password: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        value: number;
        recipeId: string;
    }>;
    commentOnRecipe(recipeId: string, userId: string, content: string): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
            bio: string | null;
            avatar: string | null;
            password: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        recipeId: string;
    }>;
    getUserFeed(userId: string, skip?: number, take?: number): Promise<any[]>;
    private getRecipeIncludes;
    private calculateRecipeStats;
}
