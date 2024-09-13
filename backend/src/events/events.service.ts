import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Events } from './events.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events) private eventsRepository: Repository<Events>,
  ) {}

  async findAll(): Promise<Events[]> {
    return await this.eventsRepository.find();
  }

  async findOne(eventId: number): Promise<Events> {
    return await this.eventsRepository.findOne({ where: { eventId } });
  }

  async create(event: Events): Promise<Events> {
    return await this.eventsRepository.save(event);
  }

  async update(eventId: number, updateData: Partial<Events>): Promise<Events> {
    // Find the existing entity
    const existingEvent = await this.eventsRepository.findOne({
      where: { eventId },
    });

    if (!existingEvent) {
      throw new Error('Event not found');
    }

    // Update the existing entity with new data
    Object.assign(existingEvent, updateData);

    // Save the updated entity
    return await this.eventsRepository.save(existingEvent);
  }

  async delete(eventId: number): Promise<void> {
    await this.eventsRepository.delete({ eventId });
  }
}
