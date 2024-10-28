import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialLinks } from './social-links.entity';

@Injectable()
export class SocialLinksService {
  constructor(
    @InjectRepository(SocialLinks)
    private readonly socialLinksRepository: Repository<SocialLinks>,
  ) {}

  async findAll(): Promise<SocialLinks[]> {
    return this.socialLinksRepository.find();
  }

  async findById(id: number): Promise<SocialLinks> {
    const socialLink = await this.socialLinksRepository.findOne({
      where: { id },
    });
    if (!socialLink) {
      throw new NotFoundException('Social Link not found');
    }
    return socialLink;
  }

  async create(data: Partial<SocialLinks>): Promise<SocialLinks> {
    const newLink = this.socialLinksRepository.create(data);
    return this.socialLinksRepository.save(newLink);
  }

  async update(id: number, data: Partial<SocialLinks>): Promise<SocialLinks> {
    const socialLink = await this.findById(id); // This will throw if not found

    // Update the social link with new data
    Object.assign(socialLink, data);

    return this.socialLinksRepository.save(socialLink);
  }

  async delete(id: number): Promise<void> {
    const result = await this.socialLinksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Social Link not found');
    }
  }
}
