import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { TABLE } from "../constants/table";
import { User } from "./user.entity";

@Entity(TABLE.WFH)
export class WorkFromHome {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (state) => state.wfh)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "text", nullable: true })
  wfhMsg: string;

  @Column({ type: "decimal", nullable: true })
  createdAt: number;

  @Column({ type: "boolean", nullable: true })
  complain: boolean;

  @Column({ type: "boolean", nullable: true })
  pmconfirm: boolean;

  @Column({ type: "text", nullable: true })
  status: string;

  @Column({ type: "text", nullable: true })
  data: string;

  @Column({ type: "text", nullable: true })
  type: string;
}
