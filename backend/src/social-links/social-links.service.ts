import { Injectable } from '@nestjs/common';
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
    return this.socialLinksRepository.findOne({ where: { id } });
  }

  async create(linkName: string, link: string): Promise<SocialLinks> {
    const newLink = this.socialLinksRepository.create({ linkName, link });
    return this.socialLinksRepository.save(newLink);
  }

  async update(
    id: number,
    linkName: string,
    link: string,
  ): Promise<SocialLinks> {
    const socialLink = await this.findById(id);

    if (!socialLink) {
      throw new Error('Social Link not found');
    }

    socialLink.linkName = linkName;
    socialLink.link = link;

    return this.socialLinksRepository.save(socialLink);
  }

  async delete(id: number): Promise<void> {
    await this.socialLinksRepository.delete(id);
  }
}
