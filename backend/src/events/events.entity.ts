import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Committees } from 'src/committees/committees.entity';
import { SubCommittees } from 'src/sub-committees/sub-committees.entity';

@Entity()
export class Events {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventName: string;

  @Column()
  eventDate: Date;

  @Column()
  eventType: string;

  @Column()
  committeeId: number;

  @Column()
  subCommitteeId: number;

  @ManyToOne(() => Committees, (committee) => committee.events)
  @JoinColumn({ name: 'committeeId' })
  committee: Committees;

  @ManyToOne(() => SubCommittees, (subCommittee) => subCommittee.events)
  @JoinColumn({ name: 'subCommitteeId' })
  subCommittee: SubCommittees;
}
