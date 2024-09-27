import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Members } from 'src/members/members.entity';

@Injectable()
export class MembersFinderService {
  constructor(
    @InjectRepository(Members)
    private membersRepository: Repository<Members>,
  ) {}

  async findAll(): Promise<string> {
    const members = await this.membersRepository.find();
    return members.map(member => member.mobileNumber).join(',');
  }

  async findByCommittee(committeeId: number): Promise<string> {
    const members = await this.membersRepository.findBy({ committeeId });
    return members.map(member => member.mobileNumber).join(',');
  }

  async findBySubCommittee(subCommitteeId: number): Promise<string> {
    const members = await this.membersRepository.findBy({ subCommitteeId });
    return members.map(member => member.mobileNumber).join(',');
  }

  async findByAddress(address: string): Promise<string> {
    const members = await this.membersRepository.findBy({ address });
    return members.map(member => member.mobileNumber).join(',');
  }

  async findByProvince(province: string): Promise<string> {
    const members = await this.membersRepository.findBy({ province });
    return members.map(member => member.mobileNumber).join(',');
  }

  async findByDistrict(district: string): Promise<string> {
    const members = await this.membersRepository.findBy({ district });
    return members.map(member => member.mobileNumber).join(',');
  }

  async findByMunicipality(municipality: string): Promise<string> {
    const members = await this.membersRepository.findBy({ municipality });
    return members.map(member => member.mobileNumber).join(',');
  }
}
