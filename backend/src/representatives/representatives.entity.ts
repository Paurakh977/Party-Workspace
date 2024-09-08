import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { SubLevel } from 'src/sub-level/sub-level.entity';

@Entity()
export class Representatives {
  @PrimaryGeneratedColumn()
  representativesId: number;

  @Column()
  memberId: string;

  @Column()
  subLevelId: number;

  @OneToOne(() => SubLevel)
  @JoinColumn({ name: 'subLevelId' })
  subLevel: SubLevel;
}
