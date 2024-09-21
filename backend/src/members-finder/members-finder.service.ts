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

  findAll(): Promise<Members[]> {
    return this.membersRepository.find();
  }

  findByCommittee(committeeId: number): Promise<Members[]> {
    return this.membersRepository.findBy({ committeeId });
  }

  findBySubCommittee(subCommitteeId: number): Promise<Members[]> {
    return this.membersRepository.findBy({ subCommitteeId });
  }

  findByAddress(address: string): Promise<Members[]> {
    return this.membersRepository.findBy({ address });
  }

  findByProvince(province: string): Promise<Members[]> {
    return this.membersRepository.findBy({ province });
  }

  findByDistrict(district: string): Promise<Members[]> {
    return this.membersRepository.findBy({ district });
  }

  findByMunicipality(municipality: string): Promise<Members[]> {
    return this.membersRepository.findBy({ municipality });
  }
}
