import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { Events } from './events.entity';
import { EventsController } from './events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Events])],
  providers: [EventsService],
  exports: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
