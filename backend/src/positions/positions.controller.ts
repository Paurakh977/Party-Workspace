import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { Positions } from './positions.entity';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  findAll(): Promise<Positions[]> {
    return this.positionsService.findAll();
  }

  @Get(':positionId')
  findOne(@Param('positionId') positionId: number): Promise<Positions> {
    return this.positionsService.findOne(positionId);
  }

  @Post()
  create(@Body() position: Positions): Promise<Positions> {
    return this.positionsService.create(position);
  }

  @Delete(':positionId')
  async remove(@Param('positionId') positionId: number): Promise<void> {
    await this.positionsService.remove(positionId);
  }
}
