import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Province {
  @PrimaryGeneratedColumn()
  provinceId: number;

  @Column()
  provinceName: string;
}
