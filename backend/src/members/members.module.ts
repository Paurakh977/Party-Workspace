import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersService } from './members.service';
import { Members } from './members.entity';
import { MembersController } from './members.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Members])],
  providers: [MembersService],
  exports: [MembersService],
  controllers: [MembersController],
})
export class MembersModule {}
