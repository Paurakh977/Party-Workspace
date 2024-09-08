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
import { Positions } from 'src/positions/positions.entity'; // Import Positions entity

@Entity()
export class Structures {
  @PrimaryGeneratedColumn()
  structureId: number;

  @Column()
  committeeId: number;

  @Column({ nullable: true })
  subCommitteeId: number;

  @Column()
  levelId: number;

  @Column()
  positionId: number;

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

  // Level must be non-nullable
  @ManyToOne(() => Levels, (levels) => levels.levelId, {
    nullable: false, // Ensures the levelId foreign key is not nullable
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'levelId' })
  level: Levels;

  // Position must be non-nullable
  @ManyToOne(() => Positions, (positions) => positions.positionId, {
    nullable: false, // Ensures the positionId foreign key is not nullable
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'positionId' })
  position: Positions;
}
