import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { SubLevelService } from './sub-level.service';
import { SubLevel } from './sub-level.entity';

@Controller('sub-level')
export class SubLevelController {
  constructor(private readonly subLevelService: SubLevelService) {}

  @Get()
  findAll(): Promise<SubLevel[]> {
    return this.subLevelService.findAll();
  }

  @Get(':subLevelId')
  findOne(@Param('subLevelId') subLevelId: number): Promise<SubLevel> {
    return this.subLevelService.findOne(subLevelId);
  }

  @Get('committee/:committeeId')
  findByCommitteeId(
    @Param('committeeId') committeeId: number,
  ): Promise<SubLevel[]> {
    return this.subLevelService.findByCommitteeId(committeeId);
  }

  @Get('sub-committee/:subCommitteeId')
  findBySubCommitteeId(
    @Param('subCommitteeId') subCommitteeId: number,
  ): Promise<SubLevel[]> {
    return this.subLevelService.findBySubCommitteeId(subCommitteeId);
  }

  @Post()
  create(@Body() subLevel: SubLevel): Promise<SubLevel> {
    return this.subLevelService.create(subLevel);
  }

  @Put(':subLevelId')
  update(
    @Param('subLevelId') subLevelId: number,
    @Body() subLevel: SubLevel,
  ): Promise<SubLevel> {
    subLevel.subLevelId = subLevelId;
    return this.subLevelService.update(subLevelId, subLevel);
  }

  @Delete(':subLevelId')
  remove(@Param('subLevelId') subLevelId: number): Promise<void> {
    return this.subLevelService.remove(subLevelId);
  }
}
