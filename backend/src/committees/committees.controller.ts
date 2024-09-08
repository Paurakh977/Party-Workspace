import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { CommitteesService } from './committees.service';
import { Committees } from './committees.entity';

@Controller('committees')
export class CommitteesController {
  constructor(private readonly committeesService: CommitteesService) {}

  @Get()
  findAll(): Promise<Committees[]> {
    return this.committeesService.findAll();
  }

  @Get(':committeeId')
  findOne(@Param('committeeId') committeeId: number): Promise<Committees> {
    return this.committeesService.findOne(committeeId);
  }

  @Post()
  create(@Body() committee: Committees): Promise<Committees> {
    return this.committeesService.create(committee);
  }

  @Put(':committeeId')
  update(
    @Param('committeeId') committeeId: number,
    @Body() committee: Committees,
  ): Promise<Committees> {
    committee.committeeId = committeeId;
    return this.committeesService.update(committee);
  }

  @Delete(':committeeId')
  async remove(@Param('committeeId') committeeId: number): Promise<void> {
    await this.committeesService.remove(committeeId);
  }
}
