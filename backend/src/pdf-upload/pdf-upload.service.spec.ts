import { Test, TestingModule } from '@nestjs/testing';
import { PdfUploadService } from './pdf-upload.service';

describe('PdfUploadService', () => {
  let service: PdfUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfUploadService],
    }).compile();

    service = module.get<PdfUploadService>(PdfUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
