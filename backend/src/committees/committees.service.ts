import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Committees } from './committees.entity';

@Injectable()
export class CommitteesService {
  constructor(
    @InjectRepository(Committees)
    private readonly committeesRepository: Repository<Committees>,
  ) {}

  findAll(): Promise<Committees[]> {
    return this.committeesRepository.find();
  }

  findOne(committeeId: number): Promise<Committees> {
    return this.committeesRepository.findOneBy({ committeeId });
  }

  create(committee: Committees): Promise<Committees> {
    return this.committeesRepository.save(committee);
  }

  async update(committee: Committees): Promise<Committees> {
    return this.committeesRepository.save(committee);
  }

  async remove(committeeId: number): Promise<void> {
    await this.committeesRepository.delete(committeeId);
  }
}
