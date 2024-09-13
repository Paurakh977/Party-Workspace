import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Members } from 'src/members/members.entity';
import { Events } from 'src/events/events.entity';

@Entity()
export class Levels {
  @PrimaryGeneratedColumn()
  levelId: number;

  @Column()
  levelName: string;

  @OneToMany(() => Members, (members) => members.level)
  members: Members;
}
