import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TABLE } from "../constants/table";

@Entity(TABLE.JOIN_CALL)
export class JoinCall {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  channelId: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  status: string;

  @Column({ type: "text", nullable: true })
  start_time: string;

  @Column({ type: "text", nullable: true })
  end_time: string;
}
