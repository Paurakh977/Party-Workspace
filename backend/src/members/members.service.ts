import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Members } from './members.entity';
import { MembersPaginationQuery, PaginatedResult } from './members.controller';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Members)
    private membersRepository: Repository<Members>,
  ) {}

  findAll(): Promise<Members[]> {
    return this.membersRepository.find();
  }

  async findAllPaginated(query: MembersPaginationQuery): Promise<PaginatedResult<Members>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.membersRepository.createQueryBuilder('member');

    if (query.search) {
      queryBuilder.where(
        '(member.memberName LIKE :search OR member.email LIKE :search OR member.mobileNumber LIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    if (query.committeeId) {
      queryBuilder.andWhere('member.committeeId = :committeeId', { 
        committeeId: query.committeeId 
      });
    }

    if (query.subCommitteeId) {
      queryBuilder.andWhere('member.subCommitteeId = :subCommitteeId', { 
        subCommitteeId: query.subCommitteeId 
      });
    }

    if (query.province) {
      queryBuilder.andWhere('member.province = :province', { 
        province: query.province 
      });
    }

    if (query.district) {
      queryBuilder.andWhere('member.district = :district', { 
        district: query.district 
      });
    }

    if (query.municipality) {
      queryBuilder.andWhere('member.municipality = :municipality', { 
        municipality: query.municipality 
      });
    }

    if (query.country) {
      queryBuilder.andWhere('member.country = :country', { 
        country: query.country 
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

  findOne(memberId: number): Promise<Members> {
    return this.membersRepository.findOne({ where: { memberId } });
  }

  findByMobileNumber(mobileNumber: string): Promise<Members> {
    return this.membersRepository.findOne({ where: { mobileNumber } });
  }

  async create(members: Members): Promise<Members> {
    return this.membersRepository.save(members);
  }

  async update(
    memberId: number,
    updatedData: Partial<Members>,
  ): Promise<Members> {
    const member = await this.membersRepository.findOne({
      where: { memberId },
    });

    if (!member) {
      throw new Error('Member not found'); // Handle this as per your error strategy
    }

    // Merge new data into the existing member object
    const updatedMember = Object.assign(member, updatedData);

    return this.membersRepository.save(updatedMember);
  }

  async remove(memberId: number): Promise<void> {
    await this.membersRepository.delete(memberId);
  }
}
