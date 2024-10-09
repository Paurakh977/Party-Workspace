import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfUploadService } from './pdf-upload.service';
import { PdfUpload } from './pdf-upload.entity';
import { PdfUploadController } from './pdf-upload.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PdfUpload])],
  providers: [PdfUploadService],
  exports: [PdfUploadService],
  controllers: [PdfUploadController],
})
export class PdfUploadModule {}
