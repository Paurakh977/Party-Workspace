import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubLevel } from './sub-level.entity';

@Injectable()
export class SubLevelService {
  constructor(
    @InjectRepository(SubLevel)
    private readonly subLevelRepository: Repository<SubLevel>,
  ) {}

  async findAll(): Promise<SubLevel[]> {
    return this.subLevelRepository.find();
  }

  async findOne(subLevelId: number): Promise<SubLevel> {
    return this.subLevelRepository.findOne({ where: { subLevelId } });
  }

  async findByCommitteeId(committeeId: number): Promise<SubLevel[]> {
    return this.subLevelRepository.find({ where: { committeeId } });
  }

  async findBySubCommitteeId(subCommitteeId: number): Promise<SubLevel[]> {
    return this.subLevelRepository.find({ where: { subCommitteeId } });
  }

  async create(subLevel: SubLevel): Promise<SubLevel> {
    return this.subLevelRepository.save(subLevel);
  }

  async update(subLevelId: number, subLevel: SubLevel): Promise<SubLevel> {
    subLevel.subLevelId = subLevelId;
    return this.subLevelRepository.save(subLevel);
  }

  async remove(subLevelId: number): Promise<void> {
    await this.subLevelRepository.delete(subLevelId);
  }
}
