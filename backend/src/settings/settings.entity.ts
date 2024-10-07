import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  settingId: number;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  carousel1: string;

  @Column({ nullable: true })
  carousel2: string;

  @Column({ nullable: true })
  carousel3: string;

  @Column({ nullable: true })
  carousel4: string;

  @Column({ nullable: true })
  carousel5: string;
}
