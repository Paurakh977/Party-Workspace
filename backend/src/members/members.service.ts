import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Members } from './members.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Members)
    private membersRepository: Repository<Members>,
  ) {}

  findAll(): Promise<Members[]> {
    return this.membersRepository.find();
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

  async update(members: Members): Promise<Members> {
    return this.membersRepository.save(members);
  }

  async remove(memberId: number): Promise<void> {
    await this.membersRepository.delete(memberId);
  }
}
