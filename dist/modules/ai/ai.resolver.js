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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiResolver = exports.RecipePairings = exports.IngredientSubstitution = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const ai_service_1 = require("./ai.service");
const recipes_service_1 = require("../recipes/recipes.service");
let IngredientSubstitution = class IngredientSubstitution {
    substitute;
    notes;
};
exports.IngredientSubstitution = IngredientSubstitution;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], IngredientSubstitution.prototype, "substitute", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], IngredientSubstitution.prototype, "notes", void 0);
exports.IngredientSubstitution = IngredientSubstitution = __decorate([
    (0, graphql_1.ObjectType)()
], IngredientSubstitution);
let RecipePairings = class RecipePairings {
    wines;
    sides;
};
exports.RecipePairings = RecipePairings;
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], RecipePairings.prototype, "wines", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], RecipePairings.prototype, "sides", void 0);
exports.RecipePairings = RecipePairings = __decorate([
    (0, graphql_1.ObjectType)()
], RecipePairings);
let AiResolver = class AiResolver {
    aiService;
    recipesService;
    constructor(aiService, recipesService) {
        this.aiService = aiService;
        this.recipesService = recipesService;
    }
    async getRecipeImprovements(recipeId) {
        const recipe = await this.recipesService.findRecipeById(recipeId);
        return this.aiService.generateRecipeImprovements(recipe);
    }
    async getIngredientSubstitutions(ingredient, dietaryRestrictions) {
        return this.aiService.suggestIngredientSubstitutions(ingredient, dietaryRestrictions);
    }
    async getCookingTips(recipeId) {
        const recipe = await this.recipesService.findRecipeById(recipeId);
        return this.aiService.generateCookingTips(recipe);
    }
    async getRecipePairings(recipeId) {
        const recipe = await this.recipesService.findRecipeById(recipeId);
        return this.aiService.suggestPairings(recipe);
    }
};
exports.AiResolver = AiResolver;
__decorate([
    (0, graphql_1.Query)(() => [String]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('recipeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiResolver.prototype, "getRecipeImprovements", null);
__decorate([
    (0, graphql_1.Query)(() => [IngredientSubstitution]),
    __param(0, (0, graphql_1.Args)('ingredient')),
    __param(1, (0, graphql_1.Args)('dietaryRestrictions', { type: () => [String], nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], AiResolver.prototype, "getIngredientSubstitutions", null);
__decorate([
    (0, graphql_1.Query)(() => [String]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('recipeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiResolver.prototype, "getCookingTips", null);
__decorate([
    (0, graphql_1.Query)(() => RecipePairings),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('recipeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiResolver.prototype, "getRecipePairings", null);
exports.AiResolver = AiResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        recipes_service_1.RecipesService])
], AiResolver);
//# sourceMappingURL=ai.resolver.js.map