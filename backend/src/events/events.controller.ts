import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Events } from './events.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(): Promise<Events[]> {
    return this.eventsService.findAll();
  }

  @Get(':eventId')
  findOne(@Param('eventId') eventId: number): Promise<Events> {
    return this.eventsService.findOne(eventId);
  }

  @Post()
  create(@Body() event: Events): Promise<Events> {
    return this.eventsService.create(event);
  }

  @Put(':eventId')
  update(
    @Param('eventId') eventId: number,
    @Body() updateData: Partial<Events>,
  ) {
    return this.eventsService.update(eventId, updateData);
  }

  @Delete(':eventId')
  delete(@Param('eventId') eventId: number) {
    return this.eventsService.delete(eventId);
  }
}
