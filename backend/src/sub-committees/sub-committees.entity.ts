import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Committees } from '../committees/committees.entity';
import { Members } from 'src/members/members.entity';
import { Events } from 'src/events/events.entity';

@Entity()
export class SubCommittees {
  @PrimaryGeneratedColumn()
  subCommitteeId: number;

  @Column()
  subCommitteeName: string;

  @Column()
  committeeId: number;

  @ManyToOne(() => Committees, (committee) => committee.subCommittees, {
    nullable: false, // Ensures the foreign key is not nullable
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'committeeId' }) // Explicitly define the foreign key column name
  committee: Committees;

  @ManyToOne(() => Members, (members) => members.subCommittee)
  members: Members;
}
