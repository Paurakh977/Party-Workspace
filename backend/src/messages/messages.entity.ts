import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  messageId: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  text: string;
}
