import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
  ParseIntPipe,
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
  async findById(@Param('id', ParseIntPipe) id: number): Promise<SocialLinks> {
    return this.socialLinkService.findById(id);
  }

  @Post()
  async create(
    @Body() socialLinkData: Partial<SocialLinks>, // Accept all fields as part of the body
  ): Promise<SocialLinks> {
    return this.socialLinkService.create(socialLinkData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() socialLinkData: Partial<SocialLinks>, // Accept all fields for update
  ): Promise<SocialLinks> {
    return this.socialLinkService.update(id, socialLinkData);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.socialLinkService.delete(id);
  }
}
