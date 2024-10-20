import { Controller, Get, Param } from '@nestjs/common';
import { MunicipalityService } from './municipality.service';
import { Municipality } from './municipality.entity';

@Controller('municipality')
export class MunicipalityController {
  constructor(private readonly municipalityService: MunicipalityService) {}

  @Get()
  findAll(): Promise<Municipality[]> {
    return this.municipalityService.findAll();
  }

  @Get(':municipalityId')
  findOne(
    @Param('municipalityId') municipalityId: number,
  ): Promise<Municipality> {
    return this.municipalityService.findOne(municipalityId);
  }
}
