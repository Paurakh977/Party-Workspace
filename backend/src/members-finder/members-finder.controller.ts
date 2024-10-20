import { Controller, Get, Param } from '@nestjs/common';
import { Members } from 'src/members/members.entity';
import { MembersFinderService } from './members-finder.service';

@Controller('members-finder')
export class MembersFinderController {
  constructor(private membersFinderService: MembersFinderService) {}

  @Get('committee/:committeeId')
  findByCommittee(@Param('committeeId') committeeId: number): Promise<string> {
    return this.membersFinderService.findByCommittee(committeeId);
  }

  @Get('subcommittee/:subCommitteeId')
  findBySubCommittee(
    @Param('subCommitteeId') subCommitteeId: number,
  ): Promise<string> {
    return this.membersFinderService.findBySubCommittee(subCommitteeId);
  }

  @Get('country/:address')
  findByAddress(@Param('country') country: string): Promise<string> {
    return this.membersFinderService.findByAddress(country);
  }

  @Get('province/:province')
  findByProvince(@Param('province') province: string): Promise<string> {
    return this.membersFinderService.findByProvince(province);
  }

  @Get('district/:district')
  findByDistrict(@Param('district') district: string): Promise<string> {
    return this.membersFinderService.findByDistrict(district);
  }

  @Get('municipality/:municipality')
  findByMunicipality(
    @Param('municipality') municipality: string,
  ): Promise<string> {
    return this.membersFinderService.findByMunicipality(municipality);
  }
}
