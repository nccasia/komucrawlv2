import { Column, Entity, JoinTable, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { TABLE } from "../constants/table";
import { BwlReaction } from "./bwlReaction.entity";

@Entity(TABLE.BWL)
export class Bwl {
  @PrimaryColumn()
  messageId: string;

  @OneToMany(() => BwlReaction, (state) => state.bwl)
  @JoinTable()
  bwlReact: BwlReaction[];

  @Column({ type: "text", nullable: true })
  channelId: string;

  @Column({ type: "text", nullable: true })
  guildId: string;

  @Column({ type: "text", nullable: true })
  authorId: string;

  @Column("text", { array: true, nullable: true })
  link: string[];

  @Column({ type: "decimal", nullable: true })
  createdTimestamp: number;
}
