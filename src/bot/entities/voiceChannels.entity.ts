import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { TABLE } from "../constants/table";

@Entity(TABLE.VOICECHANNELS)
export class VoiceChannels {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  voiceChannelId: string;

  @Column({ nullable: true })
  originalName: string;

  @Column({ nullable: true })
  newRoomName: string;

  @Column({ nullable: true, default: 0 })
  people: number;

  @Column()
  status: string;

  @Column({ type: "decimal", nullable: true })
  createdTimestamp: number;
}
