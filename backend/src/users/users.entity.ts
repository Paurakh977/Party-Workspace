import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  SuperAdmin = 'superadmin',
  Admin = 'admin',
}

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column({ nullable: true })
  credits: number;
}
