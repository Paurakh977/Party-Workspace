import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Structures } from './structures.entity';

@Injectable()
export class StructuresService {
  constructor(
    @InjectRepository(Structures)
    private readonly structuresRepository: Repository<Structures>,
  ) {}

  async findAll(): Promise<Structures[]> {
    return await this.structuresRepository.find();
  }

  async findOne(structureId: number): Promise<Structures> {
    return await this.structuresRepository.findOne({ where: { structureId } });
  }

  async create(structure: Structures): Promise<Structures> {
    return await this.structuresRepository.save(structure);
  }

  async remove(structureId: number): Promise<void> {
    await this.structuresRepository.delete(structureId);
  }

  async findByCommittee(committeeId: number): Promise<Structures[]> {
    return await this.structuresRepository.findBy({ committeeId });
  }

  async findBySubCommittee(subCommitteeId: number): Promise<Structures[]> {
    return await this.structuresRepository.findBy({ subCommitteeId });
  }

  async createMultiple(structureData: {
    committeeId: number;
    subCommitteeId: number | null;
    levelId: number;
    positionIds: number[];
  }): Promise<Structures[]> {
    const structures = structureData.positionIds.map((positionId) => {
      const structure = new Structures();
      structure.committeeId = structureData.committeeId;
      structure.subCommitteeId = structureData.subCommitteeId;
      structure.levelId = structureData.levelId;
      structure.positionId = positionId;
      return structure;
    });

    return await this.structuresRepository.save(structures);
  }
}
