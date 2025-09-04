import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PdfUpload } from './pdf-upload.entity';

@Injectable()
export class PdfUploadService {
  constructor(
    @InjectRepository(PdfUpload)
    private readonly pdfUploadRepository: Repository<PdfUpload>,
  ) {}

  // Method to save a new PDF upload
  async uploadPdf(
    fileName: string,
    filePath: string,
    mimeType: string,
    fileSize: number,
    eventId: number, // Add eventId parameter
    description?: string, // Add description parameter
  ): Promise<PdfUpload> {
    const newPdf = this.pdfUploadRepository.create({
      fileName,
      filePath,
      mimeType,
      fileSize,
      eventId, // Set the eventId
      description, // Set the description
    });
    return this.pdfUploadRepository.save(newPdf);
  }

  // Method to get all uploaded PDFs
  async findAll(): Promise<PdfUpload[]> {
    return this.pdfUploadRepository.find();
  }

  // Method to get PDFs by eventId
  async findByEventId(eventId: number): Promise<PdfUpload[]> {
    return this.pdfUploadRepository.find({ where: { eventId } });
  }

  // Method to get a PDF by ID
  async findById(id: number): Promise<PdfUpload> {
    const pdf = await this.pdfUploadRepository.findOne({ where: { id } });
    if (!pdf) {
      throw new NotFoundException(`PDF with ID ${id} not found`);
    }
    return pdf;
  }

  // Method to delete a PDF by ID
  async deletePdf(id: number): Promise<void> {
    const result = await this.pdfUploadRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`PDF with ID ${id} not found`);
    }
  }
}
