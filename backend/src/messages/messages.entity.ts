import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  messageId: number;

  @Column()
  message: string;

  @Column()
  event: string;

  @Column()
  receivers: string;

  @Column()
  creditConsumed: number;

  @Column()
  ip: string;
}
