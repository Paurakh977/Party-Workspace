import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Committees } from 'src/committees/committees.entity';
import { SubCommittees } from 'src/sub-committees/sub-committees.entity';
import { Levels } from 'src/levels/levels.entity';

@Entity()
export class Events {
  @PrimaryGeneratedColumn()
  eventId: number;

  @Column()
  eventName: string;

  @Column()
  eventStartDate: string;

  @Column()
  eventEndDate: string;

  @Column()
  eventType: string;

  @Column({ default: 'अन्य', nullable: true })
  address: string;

  @Column({ nullable: true })
  province: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  municipality: string;

  @Column({ nullable: true })
  ward: string;

  @Column({ nullable: true })
  venue: string;

  @Column()
  committeeId: number;

  @Column({ nullable: true })
  subCommitteeId: number;

  @Column({ nullable: true })
  levelId: number;

  @Column({ nullable: true })
  remarks: string;

  @ManyToOne(() => Committees, (committee) => committee.events)
  @JoinColumn({ name: 'committeeId' })
  committee: Committees;

  @ManyToOne(() => SubCommittees, (subCommittee) => subCommittee.events)
  @JoinColumn({ name: 'subCommitteeId' })
  subCommittee: SubCommittees;

  @ManyToOne(() => Levels, (level) => level.members)
  @JoinColumn({ name: 'levelId' })
  level: Levels;
}
