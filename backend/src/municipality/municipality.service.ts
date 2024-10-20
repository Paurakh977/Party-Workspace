import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Municipality } from './municipality.entity';

@Injectable()
export class MunicipalityService {
  constructor(
    @InjectRepository(Municipality)
    private readonly municipalityRepository: Repository<Municipality>,
  ) {}

  findAll(): Promise<Municipality[]> {
    return this.municipalityRepository.find();
  }

  findOne(municipalityId: number): Promise<Municipality> {
    return this.municipalityRepository.findOneBy({ municipalityId });
  }
}
