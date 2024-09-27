import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersFinderService } from './members-finder.service';
import { Members } from '../members/members.entity';
import { MembersFinderController } from './members-finder.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Members])],
  providers: [MembersFinderService],
  exports: [MembersFinderService],
  controllers: [MembersFinderController],
})
export class MembersFinderModule {}
