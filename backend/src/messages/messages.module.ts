import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { Messages } from './messages.entity';
import { Members } from '../members/members.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Messages, Members])],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
