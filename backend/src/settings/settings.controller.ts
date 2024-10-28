import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { Settings } from './settings.entity';
import { SettingsService } from './settings.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // GET /settings - Retrieve all settings
  @Get()
  findAll(): Promise<Settings[]> {
    return this.settingsService.findAll();
  }

  // GET /settings/:id - Retrieve a single setting by ID
  @Get(':id')
  findOne(@Param('id') settingId: number): Promise<Settings> {
    return this.settingsService.findOne(settingId);
  }

  // POST /settings - Create a new setting (can be used for uploading a new file or adding new settings)
  @Post()
  @UseInterceptors(
    FileInterceptor('icon', {
      limits: { fileSize: 1024 * 1024 * 5 },
      storage: diskStorage({
        destination: './public/images/logo',
        filename: (req, file, cb) => {
          const fileExt = path.extname(file.originalname);
          const fileName = `${Date.now()}${fileExt}`;
          cb(null, fileName);
        },
      }),
    }),
    FileInterceptor('carousel1', {
      limits: { fileSize: 1024 * 1024 * 5 },
      storage: diskStorage({
        destination: './public/images/carousel',
        filename: (req, file, cb) => {
          const fileExt = path.extname(file.originalname);
          const fileName = `${Date.now()}${fileExt}`;
          cb(null, fileName);
        },
      }),
    }),
    FileInterceptor('carousel2', {
      limits: { fileSize: 1024 * 1024 * 5 },
      storage: diskStorage({
        destination: './public/images/carousel',
        filename: (req, file, cb) => {
          const fileExt = path.extname(file.originalname);
          const fileName = `${Date.now()}${fileExt}`;
          cb(null, fileName);
        },
      }),
    }),
    FileInterceptor('carousel3', {
      limits: { fileSize: 1024 * 1024 * 5 },
      storage: diskStorage({
        destination: './public/images/carousel',
        filename: (req, file, cb) => {
          const fileExt = path.extname(file.originalname);
          const fileName = `${Date.now()}${fileExt}`;
          cb(null, fileName);
        },
      }),
    }),
    FileInterceptor('carousel4', {
      limits: { fileSize: 1024 * 1024 * 5 },
      storage: diskStorage({
        destination: './public/images/carousel',
        filename: (req, file, cb) => {
          const fileExt = path.extname(file.originalname);
          const fileName = `${Date.now()}${fileExt}`;
          cb(null, fileName);
        },
      }),
    }),
    FileInterceptor('carousel5', {
      limits: { fileSize: 1024 * 1024 * 5 },
      storage: diskStorage({
        destination: './public/images/carousel',
        filename: (req, file, cb) => {
          const fileExt = path.extname(file.originalname);
          const fileName = `${Date.now()}${fileExt}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async create(
    @UploadedFile('icon') iconFile: Express.Multer.File,
    @UploadedFile('carousel1') carousel1File: Express.Multer.File,
    @UploadedFile('carousel2') carousel2File: Express.Multer.File,
    @UploadedFile('carousel3') carousel3File: Express.Multer.File,
    @UploadedFile('carousel4') carousel4File: Express.Multer.File,
    @UploadedFile('carousel5') carousel5File: Express.Multer.File,
  ): Promise<Settings> {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];

    if (!allowedTypes.includes(iconFile.mimetype)) {
      throw new BadRequestException('Invalid file type for icon');
    }
    if (carousel1File && !allowedTypes.includes(carousel1File.mimetype)) {
      throw new BadRequestException('Invalid file type for carousel1');
    }
    if (carousel2File && !allowedTypes.includes(carousel2File.mimetype)) {
      throw new BadRequestException('Invalid file type for carousel2');
    }
    if (carousel3File && !allowedTypes.includes(carousel3File.mimetype)) {
      throw new BadRequestException('Invalid file type for carousel3');
    }
    if (carousel4File && !allowedTypes.includes(carousel4File.mimetype)) {
      throw new BadRequestException('Invalid file type for carousel4');
    }
    if (carousel5File && !allowedTypes.includes(carousel5File.mimetype)) {
      throw new BadRequestException('Invalid file type for carousel5');
    }

    const newSetting = new Settings();
    newSetting.icon = iconFile.filename;
    if (carousel1File) {
      newSetting.carousel1 = carousel1File.filename;
    }
    if (carousel2File) {
      newSetting.carousel2 = carousel2File.filename;
    }
    if (carousel3File) {
      newSetting.carousel3 = carousel3File.filename;
    }
    if (carousel4File) {
      newSetting.carousel4 = carousel4File.filename;
    }
    if (carousel5File) {
      newSetting.carousel5 = carousel5File.filename;
    }

    return this.settingsService.create(newSetting);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('icon', {
      limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
      storage: diskStorage({
        destination: './public/images/logo',
        filename: (req, file, cb) => {
          const fileExt = path.extname(file.originalname);
          const fileName = `${Date.now()}${fileExt}`;
          cb(null, fileName);
        },
      }),
    }),
    FileInterceptor('carousel1', {
      limits: { fileSize: 1024 * 1024 * 5 },
      storage: diskStorage({
        destination: './public/images/carousel',
        filename: (req, file, cb) => {
          const fileExt = path.extname(file.originalname);
          const fileName = `${Date.now()}${fileExt}`;
          cb(null, fileName);
        },
      }),
    }),
    FileInterceptor('carousel2', {
      limits: { fileSize: 1024 * 1024 * 5 },
      storage: diskStorage({
        destination: './public/images/carousel',
        filename: (req, file, cb) => {
          const fileExt = path.extname(file.originalname);
          const fileName = `${Date.now()}${fileExt}`;
          cb(null, fileName);
        },
      }),
    }),
    FileInterceptor('carousel3', {
      limits: { fileSize: 1024 * 1024 * 5 },
      storage: diskStorage({
        destination: './public/images/carousel',
        filename: (req, file, cb) => {
          const fileExt = path.extname(file.originalname);
          const fileName = `${Date.now()}${fileExt}`;
          cb(null, fileName);
        },
      }),
    }),
    FileInterceptor('carousel4', {
      limits: { fileSize: 1024 * 1024 * 5 },
      storage: diskStorage({
        destination: './public/images/carousel',
        filename: (req, file, cb) => {
          const fileExt = path.extname(file.originalname);
          const fileName = `${Date.now()}${fileExt}`;
          cb(null, fileName);
        },
      }),
    }),
    FileInterceptor('carousel5', {
      limits: { fileSize: 1024 * 1024 * 5 },
      storage: diskStorage({
        destination: './public/images/carousel',
        filename: (req, file, cb) => {
          const fileExt = path.extname(file.originalname);
          const fileName = `${Date.now()}${fileExt}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async update(
    @Param('id') settingId: number,
    @UploadedFile('icon') iconFile: Express.Multer.File,
    @UploadedFile('carousel1') carousel1File: Express.Multer.File,
    @UploadedFile('carousel2') carousel2File: Express.Multer.File,
    @UploadedFile('carousel3') carousel3File: Express.Multer.File,
    @UploadedFile('carousel4') carousel4File: Express.Multer.File,
    @UploadedFile('carousel5') carousel5File: Express.Multer.File,
  ): Promise<Settings> {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];

    // Validation for files
    if (iconFile && !allowedTypes.includes(iconFile.mimetype)) {
      throw new BadRequestException('Invalid icon file type');
    }

    // Find the existing setting
    const setting = await this.settingsService.findOne(settingId);
    if (!setting) {
      throw new BadRequestException('Setting not found');
    }

    // Update fields only if the file is uploaded
    if (iconFile) {
      setting.icon = iconFile.filename; // Set the new file name
    }
    if (carousel1File) {
      setting.carousel1 = carousel1File.filename;
    }
    if (carousel2File) {
      setting.carousel2 = carousel2File.filename;
    }
    if (carousel3File) {
      setting.carousel3 = carousel3File.filename;
    }
    if (carousel4File) {
      setting.carousel4 = carousel4File.filename;
    }
    if (carousel5File) {
      setting.carousel5 = carousel5File.filename;
    }

    // Save the updated setting
    return this.settingsService.update(settingId, setting);
  }

  // DELETE /settings/:id - Remove a setting by ID
  @Delete(':id')
  remove(@Param('id') settingId: number): Promise<void> {
    return this.settingsService.remove(settingId);
  }

  @Get('get-full/:id')
  async getFullSetting(@Param('id') settingId: number): Promise<Settings> {
    const setting = await this.settingsService.findOne(settingId);

    if (!setting) {
      throw new BadRequestException('Setting not found');
    }

    // Construct the full URLs for icon and carousel images
    return {
      ...setting,
      icon: setting.icon
        ? `http://localhost:3003/images/logo/${setting.icon}`
        : null,
      carousel1: setting.carousel1
        ? `http://localhost:3003/images/carousel/${setting.carousel1}`
        : null,
      carousel2: setting.carousel2
        ? `http://localhost:3003/images/carousel/${setting.carousel2}`
        : null,
      carousel3: setting.carousel3
        ? `http://localhost:3003/images/carousel/${setting.carousel3}`
        : null,
      carousel4: setting.carousel4
        ? `http://localhost:3003/images/carousel/${setting.carousel4}`
        : null,
      carousel5: setting.carousel5
        ? `http://localhost:3003/images/carousel/${setting.carousel5}`
        : null,
    };
  }
}
