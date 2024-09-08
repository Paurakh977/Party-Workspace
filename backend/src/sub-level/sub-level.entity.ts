import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Levels } from 'src/levels/levels.entity';
import { SubCommittees } from 'src/sub-committees/sub-committees.entity';
import { Committees } from 'src/committees/committees.entity';

@Entity()
export class SubLevel {
  @PrimaryGeneratedColumn()
  subLevelId: number;

  @Column()
  committeeId: number;

  @Column({ nullable: true })
  subCommitteeId: number;

  @Column()
  levelId: number;

  // Committee must be non-nullable
  @ManyToOne(() => Committees, (committees) => committees.committeeId, {
    nullable: false, // Ensures the committeeId foreign key is not nullable
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'committeeId' })
  committee: Committees;

  // SubCommittee can be nullable
  @ManyToOne(
    () => SubCommittees,
    (subCommittees) => subCommittees.subCommitteeId,
    {
      nullable: true, // Ensures the subCommitteeId foreign key can be nullable
      onDelete: 'SET NULL', // Optional: Define behavior if the related sub-committee is deleted
    },
  )
  @JoinColumn({ name: 'subCommitteeId' })
  subCommittee: SubCommittees;

  @ManyToOne(() => Levels, (levels) => levels.levelId, {
    nullable: false, // Ensures the levelId foreign key is not nullable
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'levelId' })
  level: Levels;
}
