import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from './province.entity';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
  ) {}

  findAll(): Promise<Province[]> {
    return this.provinceRepository.find();
  }

  findOne(provinceId: number): Promise<Province> {
    return this.provinceRepository.findOneBy({ provinceId });
  }
}
