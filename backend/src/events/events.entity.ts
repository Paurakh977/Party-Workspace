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
  eventHeading: string;

  @Column()
  eventDetails: string;

  @Column()
  eventDate: string;

  @Column()
  eventTime: string;

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
  eventOrganizer: string;

  @Column({ nullable: true })
  remarks: string;
}
