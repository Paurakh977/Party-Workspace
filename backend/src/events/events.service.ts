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

  async update(event: Events): Promise<Events> {
    return await this.eventsRepository.save(event);
  }

  async delete(eventId: number): Promise<void> {
    await this.eventsRepository.delete({ eventId });
  }
}
