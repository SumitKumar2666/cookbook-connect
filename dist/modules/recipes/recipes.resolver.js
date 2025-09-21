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
exports.RecipesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const recipes_service_1 = require("./recipes.service");
const recipe_dto_1 = require("./dto/recipe.dto");
let RecipesResolver = class RecipesResolver {
    recipesService;
    constructor(recipesService) {
        this.recipesService = recipesService;
    }
    async createRecipe(input, context) {
        return this.recipesService.createRecipe(input, context.req.user.id);
    }
    async recipes(filters, skip, take) {
        return this.recipesService.findAllRecipes(filters, skip, take);
    }
    async recipe(id) {
        return this.recipesService.findRecipeById(id);
    }
    async updateRecipe(id, input, context) {
        return this.recipesService.updateRecipe(id, input, context.req.user.id);
    }
    async deleteRecipe(id, context) {
        const result = await this.recipesService.deleteRecipe(id, context.req.user.id);
        return result.success;
    }
    async rateRecipe(recipeId, value, context) {
        return this.recipesService.rateRecipe(recipeId, context.req.user.id, value);
    }
    async commentOnRecipe(recipeId, content, context) {
        return this.recipesService.commentOnRecipe(recipeId, context.req.user.id, content);
    }
    async userFeed(context, skip, take) {
        return this.recipesService.getUserFeed(context.req.user.id, skip, take);
    }
};
exports.RecipesResolver = RecipesResolver;
__decorate([
    (0, graphql_1.Mutation)(() => recipe_dto_1.Recipe),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [recipe_dto_1.CreateRecipeInput, Object]),
    __metadata("design:returntype", Promise)
], RecipesResolver.prototype, "createRecipe", null);
__decorate([
    (0, graphql_1.Query)(() => [recipe_dto_1.Recipe]),
    __param(0, (0, graphql_1.Args)('filters', { nullable: true })),
    __param(1, (0, graphql_1.Args)('skip', { type: () => graphql_1.Int, defaultValue: 0 })),
    __param(2, (0, graphql_1.Args)('take', { type: () => graphql_1.Int, defaultValue: 20 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [recipe_dto_1.RecipeFilters, Number, Number]),
    __metadata("design:returntype", Promise)
], RecipesResolver.prototype, "recipes", null);
__decorate([
    (0, graphql_1.Query)(() => recipe_dto_1.Recipe),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipesResolver.prototype, "recipe", null);
__decorate([
    (0, graphql_1.Mutation)(() => recipe_dto_1.Recipe),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('input')),
    __param(2, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, recipe_dto_1.UpdateRecipeInput, Object]),
    __metadata("design:returntype", Promise)
], RecipesResolver.prototype, "updateRecipe", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RecipesResolver.prototype, "deleteRecipe", null);
__decorate([
    (0, graphql_1.Mutation)(() => recipe_dto_1.Rating),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('recipeId')),
    __param(1, (0, graphql_1.Args)('value', { type: () => graphql_1.Int })),
    __param(2, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], RecipesResolver.prototype, "rateRecipe", null);
__decorate([
    (0, graphql_1.Mutation)(() => recipe_dto_1.Comment),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('recipeId')),
    __param(1, (0, graphql_1.Args)('content')),
    __param(2, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], RecipesResolver.prototype, "commentOnRecipe", null);
__decorate([
    (0, graphql_1.Query)(() => [recipe_dto_1.Recipe]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)('skip', { type: () => graphql_1.Int, defaultValue: 0 })),
    __param(2, (0, graphql_1.Args)('take', { type: () => graphql_1.Int, defaultValue: 20 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], RecipesResolver.prototype, "userFeed", null);
exports.RecipesResolver = RecipesResolver = __decorate([
    (0, graphql_1.Resolver)(() => recipe_dto_1.Recipe),
    __metadata("design:paramtypes", [recipes_service_1.RecipesService])
], RecipesResolver);
//# sourceMappingURL=recipes.resolver.js.map