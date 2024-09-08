import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Representatives } from './representatives.entity';

@Injectable()
export class RepresentativesService {
  constructor(
    @InjectRepository(Representatives)
    private readonly representativesRepository: Repository<Representatives>,
  ) {}

  findAll(): Promise<Representatives[]> {
    return this.representativesRepository.find();
  }

  findOne(id: number): Promise<Representatives> {
    return this.representativesRepository.findOneBy({ representativesId: id });
  }

  create(representative: Representatives): Promise<Representatives> {
    return this.representativesRepository.save(representative);
  }

  async remove(id: number): Promise<void> {
    await this.representativesRepository.delete(id);
  }

  async update(representative: Representatives): Promise<Representatives> {
    return this.representativesRepository.save(representative);
  }
}
