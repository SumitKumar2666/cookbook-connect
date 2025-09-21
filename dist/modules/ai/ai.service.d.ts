import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    private openai;
    constructor(configService: ConfigService);
    generateRecipeImprovements(recipe: any): Promise<any>;
    suggestIngredientSubstitutions(ingredient: string, dietary_restrictions?: string[]): Promise<any>;
    generateCookingTips(recipe: any): Promise<any>;
    suggestPairings(recipe: any): Promise<any>;
}
