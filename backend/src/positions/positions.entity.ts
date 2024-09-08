import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Members } from 'src/members/members.entity';

@Entity()
export class Positions {
  @PrimaryGeneratedColumn()
  positionId: number;

  @Column()
  positionName: string;

  @OneToMany(() => Members, (member) => member.position)
  members: Members;
}
