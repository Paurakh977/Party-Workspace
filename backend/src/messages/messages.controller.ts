import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Messages } from './messages.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  findAll(): Promise<Messages[]> {
    return this.messagesService.findAll();
  }

  @Get(':messageId')
  findOne(@Param('messageId') messageId: number): Promise<Messages> {
    return this.messagesService.findOne(messageId);
  }

  @Post()
  async create(@Body() message: Messages): Promise<Messages> {
    try {
      // Create the message and send the SMS
      return await this.messagesService.create(message);
    } catch (error) {
      // If SMS sending fails, throw an HTTP exception
      throw new HttpException(
        error.message || 'Failed to create message or send SMS',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':messageId')
  async update(
    @Param('messageId') messageId: number,
    @Body() updateData: Partial<Messages>,
  ): Promise<Messages> {
    try {
      return await this.messagesService.update(messageId, updateData);
    } catch (error) {
      // Handle message not found or any other errors during update
      throw new HttpException(
        error.message || 'Failed to update message',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete(':messageId')
  async delete(@Param('messageId') messageId: number): Promise<void> {
    try {
      await this.messagesService.delete(messageId);
    } catch (error) {
      // Handle errors during deletion
      throw new HttpException(
        error.message || 'Failed to delete message',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
