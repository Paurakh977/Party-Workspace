import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('social_links')
export class SocialLinks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 1000 })
  linkName: string;

  @Column({ type: 'varchar', length: 1000 })
  link: string;
}
