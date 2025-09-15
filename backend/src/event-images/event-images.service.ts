import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventImage } from './event-images.entity';

@Injectable()
export class EventImagesService {
  constructor(
    @InjectRepository(EventImage)
    private readonly eventImagesRepository: Repository<EventImage>,
  ) {}

  async uploadImage(
    eventId: number,
    fileName: string,
    filePath: string,
    mimeType?: string,
    fileSize?: number,
  ): Promise<EventImage> {
    const entity = this.eventImagesRepository.create({
      eventId,
      fileName,
      filePath,
      mimeType,
      fileSize,
    });
    return this.eventImagesRepository.save(entity);
  }

  async findAll(): Promise<EventImage[]> {
    return this.eventImagesRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findByEvent(eventId: number): Promise<EventImage[]> {
    return this.eventImagesRepository.find({ where: { eventId }, order: { createdAt: 'DESC' } });
  }

  async remove(id: number): Promise<void> {
    const res = await this.eventImagesRepository.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException('Image not found');
    }
  }
}


