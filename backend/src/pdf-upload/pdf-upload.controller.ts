import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PdfUpload } from './pdf-upload.entity';
import { PdfUploadService } from './pdf-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';

function sanitizeFilename(filename: string): string {
  return filename.replace(/[<>:"/\\|?*]+/g, '-'); // Replace forbidden characters with '-'
}

@Controller('pdf-upload')
export class PdfUploadController {
  constructor(private readonly pdfUploadService: PdfUploadService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/pdf',
        filename: (req, file, callback) => {
          const sanitizedFileName = sanitizeFilename(file.originalname); // Sanitize the original filename
          callback(null, sanitizedFileName); // Use the sanitized filename directly
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is not valid');
    }

    const baseUrl = process.env.NEXT_PUBLIC_BE_HOST || 'http://localhost:3003'; // Use environment variable
    return this.pdfUploadService.uploadPdf(
      file.filename, // This is now the sanitized file name
      `${baseUrl}/pdf/${file.filename}`, // Use environment variable
      file.mimetype,
      file.size,
    );
  }

  @Get()
  async findAll(): Promise<PdfUpload[]> {
    return this.pdfUploadService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<PdfUpload> {
    return this.pdfUploadService.findById(id);
  }

  @Delete(':id')
  async deletePdf(@Param('id') id: number): Promise<void> {
    const pdf = await this.pdfUploadService.findById(id);

    if (!pdf) {
      throw new NotFoundException(`PDF with ID ${id} not found`);
    }

    // Remove the file from the filesystem
    const filePath = pdf.filePath;
    console.log(`Deleting file at: ${filePath}`);

    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      throw new BadRequestException(`Failed to delete file: ${error.message}`);
    }

    // Remove the record from the database
    return this.pdfUploadService.deletePdf(id);
  }
}
