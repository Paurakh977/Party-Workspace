import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { LevelsService } from './levels.service';
import { Levels } from './levels.entity';

@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Get()
  findAll(): Promise<Levels[]> {
    return this.levelsService.findAll();
  }

  @Get(':levelId')
  findOne(@Param('levelId') levelId: number): Promise<Levels> {
    return this.levelsService.findOne(levelId);
  }

  @Post()
  create(@Body() level: Levels): Promise<Levels> {
    return this.levelsService.create(level);
  }

  @Put(':levelId')
  update(
    @Param('levelId') levelId: number,
    @Body() level: Levels,
  ): Promise<Levels> {
    level.levelId = levelId;
    return this.levelsService.update(level);
  }

  @Delete(':levelId')
  remove(@Param('levelId') levelId: number): Promise<void> {
    return this.levelsService.remove(levelId);
  }
}
