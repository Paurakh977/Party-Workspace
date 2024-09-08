import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Representatives } from './representatives.entity';
import { RepresentativesService } from './representatives.service';

@Controller('representatives')
export class RepresentativesController {
  constructor(
    @InjectRepository(Representatives)
    private readonly representativesRepository: Repository<Representatives>,
    private readonly representativesService: RepresentativesService,
  ) {}

  @Get()
  findAll(): Promise<Representatives[]> {
    return this.representativesRepository.find();
  }

  @Get(':representativesId')
  findOne(
    @Param('representativesId') representativesId: number,
  ): Promise<Representatives> {
    return this.representativesRepository.findOne({
      where: { representativesId },
    });
  }

  @Post()
  create(@Body() representative: Representatives): Promise<Representatives> {
    return this.representativesService.create(representative);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.representativesRepository.delete(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() representative: Representatives,
  ): Promise<Representatives> {
    return this.representativesService.update(representative);
  }
}
