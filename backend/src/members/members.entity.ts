import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Levels } from 'src/levels/levels.entity';
import { Positions } from 'src/positions/positions.entity';
import { SubCommittees } from 'src/sub-committees/sub-committees.entity';
import { Committees } from 'src/committees/committees.entity';

@Entity()
export class Members {
  @PrimaryGeneratedColumn()
  memberId: number;

  @Column()
  memberName: string;

  @Column({ unique: true })
  mobileNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  committeeId: number;

  @Column({ nullable: true })
  subCommitteeId: number;

  @Column({ nullable: true })
  levelId: number;

  @Column({ nullable: true })
  positionId: number;

  @Column({ nullable: true })
  representative: string;

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

  @ManyToOne(() => Levels, (level) => level.members)
  @JoinColumn({ name: 'levelId' })
  level: Levels;

  @ManyToOne(() => Positions, (position) => position.members)
  @JoinColumn({ name: 'positionId' })
  position: Positions;

  @ManyToOne(() => SubCommittees, (subCommittee) => subCommittee.members)
  @JoinColumn({ name: 'subCommitteeId' })
  subCommittee: SubCommittees;

  @ManyToOne(() => Committees, (committee) => committee.members)
  @JoinColumn({ name: 'committeeId' })
  committee: Committees;
}
