import { AiService } from './ai.service';
import { RecipesService } from '../recipes/recipes.service';
export declare class IngredientSubstitution {
    substitute: string;
    notes: string;
}
export declare class RecipePairings {
    wines: string[];
    sides: string[];
}
export declare class AiResolver {
    private aiService;
    private recipesService;
    constructor(aiService: AiService, recipesService: RecipesService);
    getRecipeImprovements(recipeId: string): Promise<any>;
    getIngredientSubstitutions(ingredient: string, dietaryRestrictions?: string[]): Promise<any>;
    getCookingTips(recipeId: string): Promise<any>;
    getRecipePairings(recipeId: string): Promise<any>;
}
