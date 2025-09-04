import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pdf_uploads')
export class PdfUpload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 1000 })
  fileName: string;

  @Column({ type: 'varchar', length: 500 })
  filePath: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  mimeType: string;

  @Column({ type: 'int', nullable: true })
  fileSize: number; // File size in bytes

  @Column({ type: 'int', nullable: true })
  eventId: number; // Add this line to associate with an event

  @Column({ type: 'text', nullable: true })
  description: string; // Description of what the PDF is about

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
