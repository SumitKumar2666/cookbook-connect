import { SearchService } from './search.service';
import { Recipe, RecipeFilters } from '../recipes/dto/recipe.dto';
export declare class SearchResult {
    recipes: Recipe[];
    total: number;
}
export declare class SearchResolver {
    private searchService;
    constructor(searchService: SearchService);
    searchRecipes(query?: string, filters?: RecipeFilters, skip?: number, take?: number): Promise<{
        recipes: any[];
        total: number | undefined;
    }>;
    ingredientSuggestions(query: string, limit?: number): Promise<any[] | undefined>;
    cookWithWhatIHave(ingredients: string[], limit?: number): Promise<{
        recipes: any[];
        total: number | undefined;
    }>;
}
