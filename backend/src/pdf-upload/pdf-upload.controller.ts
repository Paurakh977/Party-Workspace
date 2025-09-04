import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
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
          const sanitizedFileName = sanitizeFilename(file.originalname);
          callback(null, sanitizedFileName);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('eventId') eventId: number, // Use @Body to get eventId from request body
    @Body('description') description?: string, // Add description from request body
  ) {
    if (!file) {
      throw new BadRequestException('File is not valid');
    }

    const baseUrl = process.env.NEXT_PUBLIC_BE_HOST || 'http://localhost:3003';
    return this.pdfUploadService.uploadPdf(
      file.filename,
      `${baseUrl}/pdf/${file.filename}`,
      file.mimetype,
      file.size,
      eventId, // Now eventId is correctly received
      description, // Add description
    );
  }

  @Get()
  async findAll(): Promise<PdfUpload[]> {
    return this.pdfUploadService.findAll();
  }

  @Get('event/:eventId') // New endpoint to get PDFs by eventId
  async findByEventId(@Param('eventId') eventId: number): Promise<PdfUpload[]> {
    return this.pdfUploadService.findByEventId(eventId);
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
