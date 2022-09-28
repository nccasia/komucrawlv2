import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TABLE } from "../constants/table";
import { Bwl } from "./bwl.entity";

@Entity(TABLE.BWLREACTION)
export class BwlReaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Bwl, (state) => state.bwlReact)
  @JoinTable({ name: "bwl" })
  bwl: Bwl;

  @Column({ type: "text", nullable: true })
  channelId: string;

  @Column({ type: "text", nullable: true })
  messageId: string;

  @Column({ type: "text", nullable: true })
  guildId: string;

  @Column({ type: "text", nullable: true })
  authorId: string;

  @Column({ nullable: true })
  emoji: string;

  @Column()
  count: number;

  @Column({ type: "decimal" })
  createdTimestamp: number;
}
