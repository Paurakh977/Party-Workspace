import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { Members } from './members.entity';
import { MembersService } from './members.service';

export interface MembersPaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  committeeId?: number;
  subCommitteeId?: number;
  province?: string;
  district?: string;
  municipality?: string;
  country?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Controller('members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Get()
  findAll(@Query() query: MembersPaginationQuery): Promise<PaginatedResult<Members> | Members[]> {
    if (query.page || query.limit || query.search || query.committeeId || query.subCommitteeId || query.province || query.district || query.municipality || query.country) {
      return this.membersService.findAllPaginated(query);
    }
    return this.membersService.findAll();
  }

  @Get(':memberId')
  findOne(@Param('memberId') memberId: number): Promise<Members> {
    return this.membersService.findOne(memberId);
  }

  @Post()
  create(@Body() members: Members): Promise<Members> {
    return this.membersService.create(members);
  }

  @Put(':memberId')
  async update(
    @Param('memberId') memberId: number,
    @Body() updatedData: Partial<Members>,
  ): Promise<Members> {
    return this.membersService.update(memberId, updatedData);
  }

  @Delete(':memberId')
  remove(@Param('memberId') memberId: number): Promise<void> {
    return this.membersService.remove(memberId);
  }

  @Get('mobileNumber/:mobileNumber')
  findByMobileNumber(
    @Param('mobileNumber') mobileNumber: string,
  ): Promise<Members> {
    return this.membersService.findByMobileNumber(mobileNumber);
  }
}
