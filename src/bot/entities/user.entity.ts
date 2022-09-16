import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.USER)
export class User {
  @PrimaryColumn()
  userId: string;

  @Column({ type: "text", nullable: true })
  username: string;

  @Column({ type: "text", nullable: true })
  discriminator: string;

  @Column({ type: "text", nullable: true })
  avatar: string;

  @Column({ default: false, nullable: true })
  bot: boolean;

  @Column({ default: false, nullable: true })
  system: boolean;

  @Column({ default: false, nullable: true })
  mfa_enabled: boolean;

  @Column({ type: "text", nullable: true })
  banner: string;

  @Column({ type: "text", nullable: true })
  accent_color: string;

  @Column({ type: "text", nullable: true })
  locale: string;

  @Column({ default: false, nullable: true })
  verified: boolean;

  @Column({ type: "text", nullable: true })
  email: string;

  @Column({ default: 0, nullable: true })
  flags: number;

  @Column({ default: 0, nullable: true })
  premium_type: number;

  @Column({ default: 0, nullable: true })
  public_flags: number;

  @Column({ type: "text", nullable: true })
  last_message_id: string;

  @Column({ type: "text", nullable: true })
  last_mentioned_message_id: string;

  @Column({ default: 0, nullable: true })
  scores_quiz: number;

  @Column({ type: "text", array: true, nullable: true })
  roles: string;

  @Column({ default: false, nullable: true })
  pending_wfh: boolean;

  @Column({ type: "text", nullable: true })
  last_bot_message_id: string;

  @Column({ default: false, nullable: true })
  deactive: boolean;

  @Column({ type: "text", array: true, nullable: true })
  roles_discord: string;

  @Column({ default: false, nullable: true })
  botPing: boolean;
}
