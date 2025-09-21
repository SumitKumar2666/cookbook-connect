import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesResolver } from './recipes.resolver';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [PrismaModule, RealtimeModule, SearchModule],
  providers: [RecipesService, RecipesResolver],
  exports: [RecipesService],
})
export class RecipesModule {}