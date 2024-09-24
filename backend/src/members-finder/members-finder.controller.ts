import { Controller, Get, Param } from '@nestjs/common';
import { Members } from 'src/members/members.entity';
import { MembersFinderService } from './members-finder.service';

@Controller('members-finder')
export class MembersFinderController {
  constructor(private membersFinderService: MembersFinderService) {}

  @Get('committee/:committeeId')
  findByCommittee(
    @Param('committeeId') committeeId: number,
  ): Promise<string> {
    return this.membersFinderService.findByCommittee(committeeId);
  }

  @Get('subcommittee/:subCommitteeId')
  findBySubCommittee(
    @Param('subCommitteeId') subCommitteeId: number,
  ): Promise<String> {
    return this.membersFinderService.findBySubCommittee(subCommitteeId);
  }

  @Get('address/:address')
  findByAddress(@Param('address') address: string): Promise<String> {
    return this.membersFinderService.findByAddress(address);
  }

  @Get('province/:province')
  findByProvince(@Param('province') province: string): Promise<String> {
    return this.membersFinderService.findByProvince(province);
  }

  @Get('district/:district')
  findByDistrict(@Param('district') district: string): Promise<String> {
    return this.membersFinderService.findByDistrict(district);
  }

  @Get('municipality/:municipality')
  findByMunicipality(
    @Param('municipality') municipality: string,
  ): Promise<String> {
    return this.membersFinderService.findByMunicipality(municipality);
  }
}
