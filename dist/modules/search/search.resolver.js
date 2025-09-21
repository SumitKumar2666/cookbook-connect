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
exports.SearchResolver = exports.SearchResult = void 0;
const graphql_1 = require("@nestjs/graphql");
const search_service_1 = require("./search.service");
const recipe_dto_1 = require("../recipes/dto/recipe.dto");
let SearchResult = class SearchResult {
    recipes;
    total;
};
exports.SearchResult = SearchResult;
__decorate([
    (0, graphql_1.Field)(() => [recipe_dto_1.Recipe]),
    __metadata("design:type", Array)
], SearchResult.prototype, "recipes", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], SearchResult.prototype, "total", void 0);
exports.SearchResult = SearchResult = __decorate([
    (0, graphql_1.ObjectType)()
], SearchResult);
let SearchResolver = class SearchResolver {
    searchService;
    constructor(searchService) {
        this.searchService = searchService;
    }
    async searchRecipes(query, filters, skip, take) {
        return this.searchService.searchRecipes(query, filters, skip, take);
    }
    async ingredientSuggestions(query, limit) {
        return this.searchService.getIngredientSuggestions(query, limit);
    }
    async cookWithWhatIHave(ingredients, limit) {
        return this.searchService.cookWithWhatIHave(ingredients, limit);
    }
};
exports.SearchResolver = SearchResolver;
__decorate([
    (0, graphql_1.Query)(() => SearchResult),
    __param(0, (0, graphql_1.Args)('query', { nullable: true })),
    __param(1, (0, graphql_1.Args)('filters', { nullable: true })),
    __param(2, (0, graphql_1.Args)('skip', { type: () => graphql_1.Int, defaultValue: 0 })),
    __param(3, (0, graphql_1.Args)('take', { type: () => graphql_1.Int, defaultValue: 20 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, recipe_dto_1.RecipeFilters, Number, Number]),
    __metadata("design:returntype", Promise)
], SearchResolver.prototype, "searchRecipes", null);
__decorate([
    (0, graphql_1.Query)(() => [String]),
    __param(0, (0, graphql_1.Args)('query')),
    __param(1, (0, graphql_1.Args)('limit', { type: () => graphql_1.Int, defaultValue: 10 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], SearchResolver.prototype, "ingredientSuggestions", null);
__decorate([
    (0, graphql_1.Query)(() => SearchResult),
    __param(0, (0, graphql_1.Args)('ingredients', { type: () => [String] })),
    __param(1, (0, graphql_1.Args)('limit', { type: () => graphql_1.Int, defaultValue: 20 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Number]),
    __metadata("design:returntype", Promise)
], SearchResolver.prototype, "cookWithWhatIHave", null);
exports.SearchResolver = SearchResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchResolver);
//# sourceMappingURL=search.resolver.js.map