import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelsService } from './levels.service';
import { Levels } from './levels.entity';
import { LevelsController } from './levels.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Levels])],
  providers: [LevelsService],
  exports: [LevelsService],
  controllers: [LevelsController],
})
export class LevelsModule {}
