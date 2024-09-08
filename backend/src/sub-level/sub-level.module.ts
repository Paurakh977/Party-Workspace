import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubLevelService } from './sub-level.service';
import { SubLevel } from './sub-level.entity';
import { SubLevelController } from './sub-level.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SubLevel])],
  providers: [SubLevelService],
  exports: [SubLevelService],
  controllers: [SubLevelController],
})
export class SubLevelModule {}
