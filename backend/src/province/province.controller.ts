import { Controller, Get, Param } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { Province } from './province.entity';

@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Get()
  findAll(): Promise<Province[]> {
    return this.provinceService.findAll();
  }

  @Get(':provinceId')
  findOne(@Param('provinceId') provinceId: number): Promise<Province> {
    return this.provinceService.findOne(provinceId);
  }
}
