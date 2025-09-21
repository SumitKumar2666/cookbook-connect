"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipesModule = void 0;
const common_1 = require("@nestjs/common");
const recipes_service_1 = require("./recipes.service");
const recipes_resolver_1 = require("./recipes.resolver");
const prisma_module_1 = require("../../common/prisma/prisma.module");
const realtime_module_1 = require("../realtime/realtime.module");
const search_module_1 = require("../search/search.module");
let RecipesModule = class RecipesModule {
};
exports.RecipesModule = RecipesModule;
exports.RecipesModule = RecipesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, realtime_module_1.RealtimeModule, search_module_1.SearchModule],
        providers: [recipes_service_1.RecipesService, recipes_resolver_1.RecipesResolver],
        exports: [recipes_service_1.RecipesService],
    })
], RecipesModule);
//# sourceMappingURL=recipes.module.js.map