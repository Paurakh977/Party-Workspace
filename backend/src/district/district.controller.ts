import { Controller, Get, Param } from '@nestjs/common';
import { DistrictService } from './district.service';
import { District } from './district.entity';

@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get()
  findAll(): Promise<District[]> {
    return this.districtService.findAll();
  }

  @Get(':districtId')
  findOne(@Param('districtId') districtId: number): Promise<District> {
    return this.districtService.findOne(districtId);
  }
}
