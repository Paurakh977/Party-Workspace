import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Messages {
    @PrimaryGeneratedColumn()
    messageId: number;

    @Column()
    messageHeading: string;

    @Column()
    messageBody: string;

    @Column()
    wordCount: number;
}