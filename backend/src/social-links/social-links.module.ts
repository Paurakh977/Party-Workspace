import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialLinksService } from './social-links.service';
import { SocialLinks } from './social-links.entity';
import { SocialLinksController } from './social-links.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SocialLinks])],
  providers: [SocialLinksService],
  exports: [SocialLinksService],
  controllers: [SocialLinksController],
})
export class SocialLinksModule {}
