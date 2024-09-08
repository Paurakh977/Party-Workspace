import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Levels } from './levels.entity';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(Levels)
    private readonly levelsRepository: Repository<Levels>,
  ) {}

  async findAll(): Promise<Levels[]> {
    return this.levelsRepository.find();
  }

  async findOne(levelId: number): Promise<Levels> {
    return this.levelsRepository.findOne({ where: { levelId } });
  }

  async create(level: Levels): Promise<Levels> {
    return this.levelsRepository.save(level);
  }

  async update(level: Levels): Promise<Levels> {
    return this.levelsRepository.save(level);
  }

  async remove(levelId: number): Promise<void> {
    await this.levelsRepository.delete(levelId);
  }
}
