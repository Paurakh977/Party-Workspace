import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Municipality {
  @PrimaryGeneratedColumn()
  municipalityId: number;

  @Column()
  municipalityName: string;
}
