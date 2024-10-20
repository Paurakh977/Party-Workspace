import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { District } from './district.entity';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {}

  findAll(): Promise<District[]> {
    return this.districtRepository.find();
  }

  findOne(districtId: number): Promise<District> {
    return this.districtRepository.findOneBy({ districtId });
  }
}
