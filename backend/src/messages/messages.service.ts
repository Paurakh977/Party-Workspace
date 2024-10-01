import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Messages } from './messages.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Messages)
    private messagesRepository: Repository<Messages>,
  ) {}

  async findAll(): Promise<Messages[]> {
    return await this.messagesRepository.find();
  }

  async findOne(messageId: number): Promise<Messages> {
    return await this.messagesRepository.findOne({ where: { messageId } });
  }

  async create(message: Messages): Promise<Messages> {
    return await this.messagesRepository.save(message);
  }

  async update(
    messageId: number,
    updateData: Partial<Messages>,
  ): Promise<Messages> {
    const existingMessage = await this.messagesRepository.findOne({
      where: { messageId },
    });

    if (!existingMessage) {
      throw new Error('Message not found');
    }

    Object.assign(existingMessage, updateData);

    return await this.messagesRepository.save(existingMessage);
  }

  async delete(messageId: number): Promise<void> {
    await this.messagesRepository.delete({ messageId });
  }
}
