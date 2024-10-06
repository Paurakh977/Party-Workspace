import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Messages } from './messages.entity';
import axios from 'axios'; // Import axios for API calls

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

  // Create message and send SMS
  async create(
    message: Messages,
    receivers: string[],
    event: string,
  ): Promise<Messages[]> {
    if (!receivers || receivers.length === 0) {
      throw new Error('Please select at least one receiver.');
    }

    if (!message.message) {
      throw new Error('Please write a message.');
    }

    if (!event) {
      throw new Error('Please enter an event name.');
    }

    const api_key = '9a165c2a-8924-40ef-9fcc-f5f301d55ccf';
    const client_key = 'DNv49j46fj';
    const smsUrl =
      'http://samyamgroup.com/encraft-message/api/message/send-message';

    message.receivers = JSON.stringify(receivers);
    let totalCreditConsumed = 0;

    for (const receiver of receivers) {
      const [receiverName, mobile] = receiver.split('-');

      const payload = {
        api_key: api_key,
        client_key: client_key,
        message: message.message,
        event: event,
        ip_: message.ip,
        message_id: '',
      };

      try {
        const response = await axios.post(smsUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        totalCreditConsumed += response.data.credit_consumed;
        console.log(response.data);
      } catch (error) {
        console.error(
          `Failed to send SMS to ${receiverName} (${mobile}):`,
          error.response ? error.response.data : error.message,
        );
      }
    }

    message.creditConsumed = totalCreditConsumed;
    const savedMessage = await this.messagesRepository.save(message);
    return [savedMessage];
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
