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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
let AiService = class AiService {
    configService;
    openai;
    constructor(configService) {
        this.configService = configService;
        this.openai = new openai_1.default({
            apiKey: this.configService.get('OPENAI_API_KEY'),
        });
    }
    async generateRecipeImprovements(recipe) {
        const prompt = `
      Analyze this recipe and provide 3-5 specific improvement suggestions:
      
      Title: ${recipe.title}
      Description: ${recipe.description || 'No description provided'}
      Ingredients: ${recipe.ingredients.map((ing) => `${ing.quantity} ${ing.unit || ''} ${ing.name}`).join(', ')}
      Instructions: ${recipe.instructions.map((inst) => `${inst.step}. ${inst.content}`).join(' ')}
      Difficulty: ${recipe.difficulty}
      Cooking Time: ${recipe.cookingTime} minutes
      
      Please provide practical, actionable suggestions to improve taste, technique, presentation, or nutritional value.
      Format as a JSON array of strings.
    `;
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional chef and culinary expert. Provide helpful, practical cooking advice.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                max_tokens: 500,
                temperature: 0.7,
            });
            const suggestions = JSON.parse(response.choices[0].message.content || '[]');
            return suggestions;
        }
        catch (error) {
            console.error('OpenAI API error:', error);
            return ['Unable to generate suggestions at this time. Please try again later.'];
        }
    }
    async suggestIngredientSubstitutions(ingredient, dietary_restrictions = []) {
        const restrictions = dietary_restrictions.length > 0
            ? ` considering these dietary restrictions: ${dietary_restrictions.join(', ')}`
            : '';
        const prompt = `
      Suggest 3-5 good substitutions for "${ingredient}" in cooking${restrictions}.
      Consider taste, texture, and cooking properties.
      Format as a JSON array of objects with "substitute" and "notes" fields.
      Example: [{"substitute": "coconut milk", "notes": "Use 3/4 amount, adds slight sweetness"}]
    `;
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a culinary expert specializing in ingredient substitutions and dietary alternatives.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                max_tokens: 400,
                temperature: 0.6,
            });
            const substitutions = JSON.parse(response.choices[0].message.content || '[]');
            return substitutions;
        }
        catch (error) {
            console.error('OpenAI API error:', error);
            return [{ substitute: 'No substitutions available', notes: 'Please try again later' }];
        }
    }
    async generateCookingTips(recipe) {
        const prompt = `
      Based on this recipe, provide 3-4 specific cooking tips and techniques:
      
      Title: ${recipe.title}
      Difficulty: ${recipe.difficulty}
      Cooking Time: ${recipe.cookingTime} minutes
      Key Ingredients: ${recipe.ingredients.slice(0, 5).map((ing) => ing.name).join(', ')}
      
      Focus on techniques that will help achieve better results, avoid common mistakes, or enhance flavors.
      Format as a JSON array of strings.
    `;
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional chef instructor. Provide clear, actionable cooking tips.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                max_tokens: 400,
                temperature: 0.7,
            });
            const tips = JSON.parse(response.choices[0].message.content || '[]');
            return tips;
        }
        catch (error) {
            console.error('OpenAI API error:', error);
            return ['No tips available at this time. Please try again later.'];
        }
    }
    async suggestPairings(recipe) {
        const prompt = `
      Suggest wine pairings and side dishes for this recipe:
      
      Title: ${recipe.title}
      Cuisine: ${recipe.cuisine || 'Not specified'}
      Main Ingredients: ${recipe.ingredients.slice(0, 5).map((ing) => ing.name).join(', ')}
      
      Provide 2-3 wine suggestions and 2-3 side dish suggestions.
      Format as JSON with "wines" and "sides" arrays.
      Example: {"wines": ["Pinot Noir", "Chardonnay"], "sides": ["Roasted vegetables", "Rice pilaf"]}
    `;
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a sommelier and culinary expert specializing in food and wine pairings.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                max_tokens: 300,
                temperature: 0.6,
            });
            const pairings = JSON.parse(response.choices[0].message.content || '{"wines": [], "sides": []}');
            return pairings;
        }
        catch (error) {
            console.error('OpenAI API error:', error);
            return { wines: ['No suggestions available'], sides: ['No suggestions available'] };
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map