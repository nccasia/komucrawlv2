import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.MSG)
export class MSG {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: true })
  channelId: string;

  @Column({ type: "text", nullable: true })
  guildId: string;

  @Column({ nullable: true })
  deleted: boolean;

  @Column({ nullable: true, unique: true })
  messageId: string;

  @Column({ nullable: true })
  createdTimestamp: string;

  @Column({ type: "text", nullable: true })
  type: string;

  @Column({ nullable: true })
  system: boolean;

  @Column({ type: "text", nullable: true })
  content: string;

  @Column({ type: "text", nullable: true })
  author: string;

  @Column({ nullable: true })
  pinned: boolean;

  @Column({ nullable: true })
  tts: boolean;

  @Column({ type: "text", nullable: true })
  nonce: string;

  @Column({ nullable: true })
  embeds: string;

  @Column({ nullable: true })
  components: string;

  @Column({ nullable: true })
  attachments: string;

  @Column({ nullable: true })
  stickers: string;

  @Column({ nullable: true })
  editedTimestamp: string;

  @Column({ nullable: true })
  reactions: string;

  @Column({ nullable: true })
  mentions: string;

  @Column({ type: "text", nullable: true })
  webhookId: string;

  @Column({ type: "text", nullable: true })
  groupActivityApplication: string;

  @Column({ type: "text", nullable: true })
  applicationId: string;

  @Column({ type: "text", nullable: true })
  activity: string;

  @Column({ nullable: true })
  flags: number;

  @Column({ type: "text", nullable: true })
  reference: string;

  @Column({ type: "text", nullable: true })
  interaction: string;
}
