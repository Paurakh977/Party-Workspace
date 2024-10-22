import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { SocialLinks } from './social-links.entity';
import { SocialLinksService } from './social-links.service';

@Controller('social-links')
export class SocialLinksController {
  constructor(private readonly socialLinkService: SocialLinksService) {}

  @Get()
  async findAll(): Promise<SocialLinks[]> {
    return this.socialLinkService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<SocialLinks> {
    return this.socialLinkService.findById(id);
  }

  @Post()
  async create(
    @Body('linkName') linkName: string,
    @Body('link') link: string,
  ): Promise<SocialLinks> {
    return this.socialLinkService.create(linkName, link);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('linkName') linkName: string,
    @Body('link') link: string,
  ): Promise<SocialLinks> {
    return this.socialLinkService.update(id, linkName, link);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.socialLinkService.delete(id);
  }
}
