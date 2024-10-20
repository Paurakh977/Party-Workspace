import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class District {
  @PrimaryGeneratedColumn()
  districtId: number;

  @Column()
  districtName: string;
}
