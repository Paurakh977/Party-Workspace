import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { Members } from './members.entity';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Get()
  findAll(): Promise<Members[]> {
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
  findByMobileNumber(@Param('mobileNumber') mobileNumber: string) {
    return this.membersService.findByMobileNumber(mobileNumber);
  }
}
