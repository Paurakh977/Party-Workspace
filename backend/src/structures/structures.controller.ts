import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { StructuresService } from './structures.service';
import { Structures } from './structures.entity';

@Controller('structures')
export class StructuresController {
  constructor(private readonly structuresService: StructuresService) {}

  @Get()
  findAll(): Promise<Structures[]> {
    return this.structuresService.findAll();
  }

  @Get(':structureId')
  findOne(@Param('structureId') structureId: number): Promise<Structures> {
    return this.structuresService.findOne(structureId);
  }

  @Post()
  create(
    @Body()
    structureData: {
      committeeId: number;
      subCommitteeId: number | null;
      levelId: number;
      positionIds: number[];
    },
  ): Promise<Structures[]> {
    return this.structuresService.createMultiple(structureData);
  }

  @Delete(':structureId')
  remove(@Param('structureId') structureId: number): Promise<void> {
    return this.structuresService.remove(structureId);
  }

  @Get('committee/:committeeId')
  findByCommittee(
    @Param('committeeId') committeeId: number,
  ): Promise<Structures[]> {
    return this.structuresService.findByCommittee(committeeId);
  }

  @Get('subcommittee/:subCommitteeId')
  findBySubCommittee(
    @Param('subCommitteeId') subCommitteeId: number,
  ): Promise<Structures[]> {
    return this.structuresService.findBySubCommittee(subCommitteeId);
  }
}
