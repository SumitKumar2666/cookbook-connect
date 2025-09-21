import { RecipesService } from './recipes.service';
import { CreateRecipeInput, UpdateRecipeInput, RecipeFilters } from './dto/recipe.dto';
export declare class RecipesResolver {
    private recipesService;
    constructor(recipesService: RecipesService);
    createRecipe(input: CreateRecipeInput, context: any): Promise<{
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
    recipes(filters?: RecipeFilters, skip?: number, take?: number): Promise<any[]>;
    recipe(id: string): Promise<any>;
    updateRecipe(id: string, input: UpdateRecipeInput, context: any): Promise<any>;
    deleteRecipe(id: string, context: any): Promise<boolean>;
    rateRecipe(recipeId: string, value: number, context: any): Promise<{
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
    commentOnRecipe(recipeId: string, content: string, context: any): Promise<{
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
    userFeed(context: any, skip?: number, take?: number): Promise<any[]>;
}
