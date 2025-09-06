import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Messages } from './messages.entity';
import { Members } from '../members/members.entity';
import axios from 'axios'; // Import axios for API calls

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Messages)
    private messagesRepository: Repository<Messages>,
    @InjectRepository(Members)
    private membersRepository: Repository<Members>,
  ) {}

  async findAll(): Promise<Messages[]> {
    return await this.messagesRepository.find();
  }

  async findOne(messageId: number): Promise<Messages> {
    return await this.messagesRepository.findOne({ where: { messageId } });
  }

  // Get filtered members based on criteria
  async getFilteredMembers(filters: {
    committeeId?: number;
    subCommitteeId?: number;
    province?: string;
    district?: string;
    municipality?: string;
    address?: string;
  }): Promise<Members[]> {
    const queryBuilder = this.membersRepository.createQueryBuilder('member');
    
    // Apply filters if they exist
    if (filters.committeeId) {
      queryBuilder.andWhere('member.committeeId = :committeeId', { 
        committeeId: filters.committeeId 
      });
    }

    if (filters.subCommitteeId) {
      queryBuilder.andWhere('member.subCommitteeId = :subCommitteeId', { 
        subCommitteeId: filters.subCommitteeId 
      });
    }

    if (filters.province) {
      queryBuilder.andWhere('member.province = :province', { 
        province: filters.province 
      });
    }

    if (filters.district) {
      queryBuilder.andWhere('member.district = :district', { 
        district: filters.district 
      });
    }

    if (filters.municipality) {
      queryBuilder.andWhere('member.municipality = :municipality', { 
        municipality: filters.municipality 
      });
    }
    
    if (filters.address) {
      queryBuilder.andWhere('member.address = :address', { 
        address: filters.address 
      });
    }

    return await queryBuilder.getMany();
  }

  // Create message and send SMS
  async create(
    message: Messages,
    receivers: string[],
    event: string,
    filters?: {
      committeeId?: number;
      subCommitteeId?: number;
      province?: string;
      district?: string;
      municipality?: string;
      address?: string;
    },
  ): Promise<Messages[]> {
    let recipientList: string[] = [];
    
    // If filters are provided, use them to get filtered members
    if (filters && Object.keys(filters).length > 0) {
      const filteredMembers = await this.getFilteredMembers(filters);
      
      // Format members as 'name-mobile' for SMS sending
      recipientList = filteredMembers
        .filter(member => {
          const mobile = member.mobileNumber;
          // Check if the mobile number is 10 digits and contains only ASCII characters
          return mobile && /^[\x00-\x7F]*$/.test(mobile) && mobile.length === 10;
        })
        .map(member => `${member.memberName}-${member.mobileNumber}`);
    } else {
      // If no filters, use the provided receivers list
      recipientList = receivers;
    }
    
    if (!recipientList || recipientList.length === 0) {
      throw new Error('No recipients match the selected criteria or no recipients provided.');
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

    message.receivers = JSON.stringify(recipientList);
    let totalCreditConsumed = 0;

    for (const receiver of recipientList) {
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
