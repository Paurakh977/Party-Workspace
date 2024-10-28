import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('social_links')
export class SocialLinks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 1000 })
  linkName: string;

  @Column({ type: 'varchar', length: 1000 })
  link: string;

  @Column({ nullable: true })
  linkDate: string;

  @Column({ nullable: true })
  linkPublisher: string;

  @Column({ default: '0', nullable: true })
  country: string;

  @Column({ nullable: true })
  province: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  municipality: string;

  @Column({ nullable: true })
  ward: string;
}
