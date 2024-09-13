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
