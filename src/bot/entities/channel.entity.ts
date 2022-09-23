import { Column, Entity, PrimaryColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.CHANNEL)
export class Channel {
  @PrimaryColumn()
  channelId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  type: string;

  @Column()
  nsfw: boolean;

  @Column()
  rawPosition: number;

  @Column()
  lastMessageId: string;

  @Column()
  rateLimitPerUser: number;

  @Column()
  parentId: string;
}
