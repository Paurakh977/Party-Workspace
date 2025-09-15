import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { EventImagesService } from './event-images.service';

function sanitizeFilename(filename: string): string {
  return filename.replace(/[<>:"/\\|?*]+/g, '-');
}

@Controller('event-images')
export class EventImagesController {
  constructor(private readonly eventImagesService: EventImagesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dest = './public/images/events';
          try {
            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest, { recursive: true });
            }
          } catch (e) {}
          cb(null, dest);
        },
        filename: (req, file, cb) => {
          const sanitized = sanitizeFilename(file.originalname);
          cb(null, sanitized);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('eventId') eventId: number,
  ) {
    if (!file) {
      throw new BadRequestException('File is not valid');
    }
    if (!eventId) {
      throw new BadRequestException('eventId is required');
    }
    const baseUrl = process.env.NEXT_PUBLIC_BE_HOST || 'http://localhost:3003';
    return this.eventImagesService.uploadImage(
      Number(eventId),
      file.filename,
      `${baseUrl}/images/events/${file.filename}`,
      file.mimetype,
      file.size,
    );
  }

  @Get()
  async listAll() {
    return this.eventImagesService.findAll();
  }

  @Get('event/:eventId')
  async listByEvent(@Param('eventId') eventId: number) {
    return this.eventImagesService.findByEvent(Number(eventId));
  }

  @Post('uploads')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dest = './public/images/events';
          try {
            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest, { recursive: true });
            }
          } catch (e) {}
          cb(null, dest);
        },
        filename: (req, file, cb) => {
          const sanitized = sanitizeFilename(file.originalname);
          cb(null, sanitized);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async multiUpload(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('eventId') eventId: number,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    if (!eventId) {
      throw new BadRequestException('eventId is required');
    }
    const baseUrl = process.env.NEXT_PUBLIC_BE_HOST || 'http://localhost:3003';
    const results = await Promise.all(
      files.map((file) =>
        this.eventImagesService.uploadImage(
          Number(eventId),
          file.filename,
          `${baseUrl}/images/events/${file.filename}`,
          file.mimetype,
          file.size,
        ),
      ),
    );
    return results;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.eventImagesService.remove(Number(id));
  }
}


