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
  
  @Post('count-recipients')
  async countRecipients(
    @Body()
    body: {
      filters: {
        committeeId?: number;
        subCommitteeId?: number;
        province?: string;
        district?: string;
        municipality?: string;
        address?: string;
      };
    },
  ): Promise<{ count: number }> {
    try {
      const { filters } = body;
      const filteredMembers = await this.messagesService.getFilteredMembers(filters);
      
      // Count only valid mobile numbers
      const validMembersCount = filteredMembers.filter(member => {
        const mobile = member.mobileNumber;
        return mobile && /^[\x00-\x7F]*$/.test(mobile) && mobile.length === 10;
      }).length;
      
      return { count: validMembersCount };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to count recipients',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  findAll(): Promise<Messages[]> {
    return this.messagesService.findAll();
  }

  @Get(':messageId')
  findOne(@Param('messageId') messageId: number): Promise<Messages> {
    return this.messagesService.findOne(messageId);
  }

  @Post()
  async create(
    @Body()
    body: {
      message: Messages;
      receivers: string[];
      event_name: string;
      filters?: {
        committeeId?: number;
        subCommitteeId?: number;
        province?: string;
        district?: string;
        municipality?: string;
        address?: string;
      };
    },
  ): Promise<Messages[]> {
    const { message, receivers, event_name, filters } = body;
    try {
      // Create the message and send the SMS
      return await this.messagesService.create(message, receivers, event_name, filters);
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
