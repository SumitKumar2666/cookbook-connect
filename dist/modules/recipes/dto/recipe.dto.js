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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeFilters = exports.UpdateRecipeInput = exports.CreateRecipeInput = exports.CreateInstructionInput = exports.CreateIngredientInput = exports.Recipe = exports.Comment = exports.Rating = exports.Instruction = exports.Ingredient = void 0;
const graphql_1 = require("@nestjs/graphql");
const user_dto_1 = require("../../users/dto/user.dto");
let Ingredient = class Ingredient {
    id;
    name;
    quantity;
    unit;
};
exports.Ingredient = Ingredient;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Ingredient.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Ingredient.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Ingredient.prototype, "quantity", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Ingredient.prototype, "unit", void 0);
exports.Ingredient = Ingredient = __decorate([
    (0, graphql_1.ObjectType)()
], Ingredient);
let Instruction = class Instruction {
    id;
    step;
    content;
};
exports.Instruction = Instruction;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Instruction.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Instruction.prototype, "step", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Instruction.prototype, "content", void 0);
exports.Instruction = Instruction = __decorate([
    (0, graphql_1.ObjectType)()
], Instruction);
let Rating = class Rating {
    id;
    value;
    createdAt;
    user;
};
exports.Rating = Rating;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Rating.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Rating.prototype, "value", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Rating.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_dto_1.User),
    __metadata("design:type", user_dto_1.User)
], Rating.prototype, "user", void 0);
exports.Rating = Rating = __decorate([
    (0, graphql_1.ObjectType)()
], Rating);
let Comment = class Comment {
    id;
    content;
    createdAt;
    updatedAt;
    user;
};
exports.Comment = Comment;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Comment.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Comment.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Comment.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_dto_1.User),
    __metadata("design:type", user_dto_1.User)
], Comment.prototype, "user", void 0);
exports.Comment = Comment = __decorate([
    (0, graphql_1.ObjectType)()
], Comment);
let Recipe = class Recipe {
    id;
    title;
    description;
    cuisine;
    difficulty;
    cookingTime;
    servings;
    imageUrl;
    createdAt;
    updatedAt;
    author;
    ingredients;
    instructions;
    ratings;
    comments;
    averageRating;
    totalRatings;
};
exports.Recipe = Recipe;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Recipe.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Recipe.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Recipe.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Recipe.prototype, "cuisine", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Recipe.prototype, "difficulty", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Recipe.prototype, "cookingTime", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Recipe.prototype, "servings", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Recipe.prototype, "imageUrl", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Recipe.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Recipe.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_dto_1.User),
    __metadata("design:type", user_dto_1.User)
], Recipe.prototype, "author", void 0);
__decorate([
    (0, graphql_1.Field)(() => [Ingredient]),
    __metadata("design:type", Array)
], Recipe.prototype, "ingredients", void 0);
__decorate([
    (0, graphql_1.Field)(() => [Instruction]),
    __metadata("design:type", Array)
], Recipe.prototype, "instructions", void 0);
__decorate([
    (0, graphql_1.Field)(() => [Rating]),
    __metadata("design:type", Array)
], Recipe.prototype, "ratings", void 0);
__decorate([
    (0, graphql_1.Field)(() => [Comment]),
    __metadata("design:type", Array)
], Recipe.prototype, "comments", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], Recipe.prototype, "averageRating", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Recipe.prototype, "totalRatings", void 0);
exports.Recipe = Recipe = __decorate([
    (0, graphql_1.ObjectType)()
], Recipe);
let CreateIngredientInput = class CreateIngredientInput {
    name;
    quantity;
    unit;
};
exports.CreateIngredientInput = CreateIngredientInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateIngredientInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateIngredientInput.prototype, "quantity", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateIngredientInput.prototype, "unit", void 0);
exports.CreateIngredientInput = CreateIngredientInput = __decorate([
    (0, graphql_1.InputType)()
], CreateIngredientInput);
let CreateInstructionInput = class CreateInstructionInput {
    step;
    content;
};
exports.CreateInstructionInput = CreateInstructionInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], CreateInstructionInput.prototype, "step", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateInstructionInput.prototype, "content", void 0);
exports.CreateInstructionInput = CreateInstructionInput = __decorate([
    (0, graphql_1.InputType)()
], CreateInstructionInput);
let CreateRecipeInput = class CreateRecipeInput {
    title;
    description;
    cuisine;
    difficulty;
    cookingTime;
    servings;
    imageUrl;
    ingredients;
    instructions;
};
exports.CreateRecipeInput = CreateRecipeInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateRecipeInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateRecipeInput.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateRecipeInput.prototype, "cuisine", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateRecipeInput.prototype, "difficulty", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], CreateRecipeInput.prototype, "cookingTime", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], CreateRecipeInput.prototype, "servings", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateRecipeInput.prototype, "imageUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => [CreateIngredientInput]),
    __metadata("design:type", Array)
], CreateRecipeInput.prototype, "ingredients", void 0);
__decorate([
    (0, graphql_1.Field)(() => [CreateInstructionInput]),
    __metadata("design:type", Array)
], CreateRecipeInput.prototype, "instructions", void 0);
exports.CreateRecipeInput = CreateRecipeInput = __decorate([
    (0, graphql_1.InputType)()
], CreateRecipeInput);
let UpdateRecipeInput = class UpdateRecipeInput {
    title;
    description;
    cuisine;
    difficulty;
    cookingTime;
    servings;
    imageUrl;
};
exports.UpdateRecipeInput = UpdateRecipeInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateRecipeInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateRecipeInput.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateRecipeInput.prototype, "cuisine", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateRecipeInput.prototype, "difficulty", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], UpdateRecipeInput.prototype, "cookingTime", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], UpdateRecipeInput.prototype, "servings", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateRecipeInput.prototype, "imageUrl", void 0);
exports.UpdateRecipeInput = UpdateRecipeInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateRecipeInput);
let RecipeFilters = class RecipeFilters {
    cuisine;
    difficulty;
    maxCookingTime;
    ingredients;
    minRating;
};
exports.RecipeFilters = RecipeFilters;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeFilters.prototype, "cuisine", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeFilters.prototype, "difficulty", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], RecipeFilters.prototype, "maxCookingTime", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], RecipeFilters.prototype, "ingredients", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], RecipeFilters.prototype, "minRating", void 0);
exports.RecipeFilters = RecipeFilters = __decorate([
    (0, graphql_1.InputType)()
], RecipeFilters);
//# sourceMappingURL=recipe.dto.js.map