import { Entity, OneToMany, Column, PrimaryGeneratedColumn } from 'typeorm';
import { SubCommittees } from 'src/sub-committees/sub-committees.entity';
import { Members } from 'src/members/members.entity';
import { Events } from 'src/events/events.entity';

@Entity()
export class Committees {
  @PrimaryGeneratedColumn()
  committeeId: number;

  @Column()
  committeeName: string;

  @OneToMany(() => SubCommittees, (subCommittees) => subCommittees.committee, {
    onDelete: 'CASCADE',
  })
  subCommittees: SubCommittees[];

  @OneToMany(() => Members, (members) => members.committee, {
    onDelete: 'CASCADE',
  })
  members: Members[];

  @OneToMany(() => Events, (events) => events.committee, {
    onDelete: 'CASCADE',
  })
  events: Events[];
}
