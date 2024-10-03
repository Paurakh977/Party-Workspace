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
  async create(message: Messages): Promise<Messages> {
    // First, save the message to the database
    const savedMessage = await this.messagesRepository.save(message);

    // After saving the message, send the SMS using the Sparrow SMS API
    const smsResponse = await this.sendSms(message);

    if (smsResponse.status !== 200) {
      throw new Error(`Failed to send SMS: ${smsResponse.data.response}`);
    }

    // Return the saved message if SMS was successful
    return savedMessage;
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

  // Helper method to send SMS via Sparrow SMS API
  private async sendSms(message: Messages) {
    const sparrowSmsUrl = 'http://api.sparrowsms.com/v2/sms/';
    const apiToken = 'CCRfjs0IZfeyZsOAFWxl'; // Your Sparrow SMS token
    const from = message.from; // Your sender identity
    const to = message.to; // Recipient phone number

    try {
      // Send the SMS request
      const response = await axios.post(sparrowSmsUrl, {
        token: apiToken,
        from: from,
        to: to,
        text: message.text, // Ensure `message.text` has the message content
      });

      // Log and return response data if successful
      console.log('SMS sent successfully:', response.data);
      return response.data;
    } catch (error) {
      // Check if error.response exists before trying to access its properties
      if (error.response) {
        console.error('SMS API Error:', error.response.data);
        throw new Error(`SMS API Error: ${error.response.data.response}`);
      } else {
        // Handle case where there's no response (e.g., network error)
        console.error('Network or other error:', error.message);
        throw new Error(`Network error: ${error.message}`);
      }
    }
  }
}
