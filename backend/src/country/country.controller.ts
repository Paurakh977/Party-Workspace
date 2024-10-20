import { Controller, Get, Param } from '@nestjs/common';
import { CountryService } from './country.service';
import { Country } from './country.entity';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  findAll(): Promise<Country[]> {
    return this.countryService.findAll();
  }

  @Get(':countryId')
  findOne(@Param('countryId') countryId: number): Promise<Country> {
    return this.countryService.findOne(countryId);
  }
}
