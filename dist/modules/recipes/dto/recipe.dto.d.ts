import { User } from '../../users/dto/user.dto';
export declare class Ingredient {
    id: string;
    name: string;
    quantity: string;
    unit?: string;
}
export declare class Instruction {
    id: string;
    step: number;
    content: string;
}
export declare class Rating {
    id: string;
    value: number;
    createdAt: Date;
    user: User;
}
export declare class Comment {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
export declare class Recipe {
    id: string;
    title: string;
    description?: string;
    cuisine?: string;
    difficulty: string;
    cookingTime: number;
    servings: number;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    author: User;
    ingredients: Ingredient[];
    instructions: Instruction[];
    ratings: Rating[];
    comments: Comment[];
    averageRating: number;
    totalRatings: number;
}
export declare class CreateIngredientInput {
    name: string;
    quantity: string;
    unit?: string;
}
export declare class CreateInstructionInput {
    step: number;
    content: string;
}
export declare class CreateRecipeInput {
    title: string;
    description?: string;
    cuisine?: string;
    difficulty: string;
    cookingTime: number;
    servings: number;
    imageUrl?: string;
    ingredients: CreateIngredientInput[];
    instructions: CreateInstructionInput[];
}
export declare class UpdateRecipeInput {
    title?: string;
    description?: string;
    cuisine?: string;
    difficulty?: string;
    cookingTime?: number;
    servings?: number;
    imageUrl?: string;
}
export declare class RecipeFilters {
    cuisine?: string;
    difficulty?: string;
    maxCookingTime?: number;
    ingredients?: string[];
    minRating?: number;
}
