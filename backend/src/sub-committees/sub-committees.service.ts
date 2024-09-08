import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCommittees } from './sub-committees.entity';

@Injectable()
export class SubCommitteesService {
  constructor(
    @InjectRepository(SubCommittees)
    private readonly subCommitteesRepository: Repository<SubCommittees>,
  ) {}

  findAll(): Promise<SubCommittees[]> {
    return this.subCommitteesRepository.find();
  }

  findOne(subCommitteeId: number): Promise<SubCommittees> {
    return this.subCommitteesRepository.findOneBy({ subCommitteeId });
  }

  create(subCommittee: SubCommittees): Promise<SubCommittees> {
    return this.subCommitteesRepository.save(subCommittee);
  }

  async update(subCommittee: SubCommittees): Promise<SubCommittees> {
    return this.subCommitteesRepository.save(subCommittee);
  }

  async remove(subCommitteeId: number): Promise<void> {
    await this.subCommitteesRepository.delete(subCommitteeId);
  }

  async findByCommitteeId(committeeId: number): Promise<SubCommittees[]> {
    return this.subCommitteesRepository.find({
      where: { committee: { committeeId } },
    });
  }
}
