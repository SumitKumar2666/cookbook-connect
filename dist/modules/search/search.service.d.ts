import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
export declare class SearchService implements OnModuleInit {
    private configService;
    private prisma;
    private esClient;
    constructor(configService: ConfigService, prisma: PrismaService);
    onModuleInit(): Promise<void>;
    private createRecipeIndex;
    indexRecipe(recipeId: string): Promise<void>;
    private indexAllRecipes;
    searchRecipes(query?: string, filters?: any, skip?: number, take?: number): Promise<{
        recipes: any[];
        total: number | undefined;
    }>;
    getIngredientSuggestions(query: string, limit?: number): Promise<any[] | undefined>;
    cookWithWhatIHave(availableIngredients: string[], limit?: number): Promise<{
        recipes: any[];
        total: number | undefined;
    }>;
}
