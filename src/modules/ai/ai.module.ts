import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiResolver } from './ai.resolver';
import { RecipesModule } from '../recipes/recipes.module';

@Module({
  imports: [RecipesModule],
  providers: [AiService, AiResolver],
  exports: [AiService],
})
export class AiModule {}