import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
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
    create(@Body() message: Messages): Promise<Messages> {
        return this.messagesService.create(message);
    }

    @Put(':messageId')
    update(
        @Param('messageId') messageId: number,
        @Body() updateData: Partial<Messages>,
    ) {
        return this.messagesService.update(messageId, updateData);
    }

    @Delete(':messageId')
    delete(@Param('messageId') messageId: number) {
        return this.messagesService.delete(messageId);
    }
}
