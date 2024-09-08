import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { SubCommitteesService } from './sub-committees.service';
import { SubCommittees } from './sub-committees.entity';

@Controller('sub-committees')
export class SubCommitteesController {
  constructor(private readonly subCommitteesService: SubCommitteesService) {}

  @Get()
  findAll(): Promise<SubCommittees[]> {
    return this.subCommitteesService.findAll();
  }

  @Get(':subCommitteeId')
  findOne(
    @Param('subCommitteeId') subCommitteeId: number,
  ): Promise<SubCommittees> {
    return this.subCommitteesService.findOne(subCommitteeId);
  }

  @Post()
  create(@Body() subCommittee: SubCommittees): Promise<SubCommittees> {
    return this.subCommitteesService.create(subCommittee);
  }

  @Put(':subCommitteeId')
  update(
    @Param('subCommitteeId') subCommitteeId: number,
    @Body() subCommittee: SubCommittees,
  ): Promise<SubCommittees> {
    return this.subCommitteesService.update(subCommittee);
  }

  @Delete(':subCommitteeId')
  remove(@Param('subCommitteeId') subCommitteeId: number): Promise<void> {
    return this.subCommitteesService.remove(subCommitteeId);
  }

  @Get('committee/:committeeId')
  findByCommitteeId(
    @Param('committeeId') committeeId: number,
  ): Promise<SubCommittees[]> {
    return this.subCommitteesService.findByCommitteeId(committeeId);
  }
}
