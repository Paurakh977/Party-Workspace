import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Committees } from './committees.entity';
import { PaginationQuery, PaginatedResult } from './committees.controller';

@Injectable()
export class CommitteesService {
  constructor(
    @InjectRepository(Committees)
    private readonly committeesRepository: Repository<Committees>,
  ) {}

  findAll(): Promise<Committees[]> {
    return this.committeesRepository.find();
  }

  async findAllPaginated(query: PaginationQuery): Promise<PaginatedResult<Committees>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.committeesRepository.createQueryBuilder('committee');

    if (query.search) {
      queryBuilder.where('committee.committeeName LIKE :search', {
        search: `%${query.search}%`,
      });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
