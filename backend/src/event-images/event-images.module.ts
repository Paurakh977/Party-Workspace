import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventImage } from './event-images.entity';
import { EventImagesService } from './event-images.service';
import { EventImagesController } from './event-images.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EventImage])],
  providers: [EventImagesService],
  exports: [EventImagesService],
  controllers: [EventImagesController],
})
export class EventImagesModule {}


