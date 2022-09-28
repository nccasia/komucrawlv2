import { InjectDiscordClient } from "@discord-nestjs/core";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client, VoiceState } from "discord.js";
import { Repository } from "typeorm";
import { CheckCamera } from "../entities/checkCamera.entity";
import { JoinCall } from "../entities/joinCall.entity";
import { VoiceChannels } from "../entities/voiceChannels.entity";

@Injectable()
export class VoiceStateService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @InjectRepository(JoinCall)
    private joinCallRepository: Repository<JoinCall>,
    @InjectRepository(VoiceChannels)
    private voiceChannelsRepository: Repository<VoiceChannels>,
    @InjectRepository(CheckCamera)
    private checkCameraRepository: Repository<CheckCamera>
  ) {}

  async addJoinCall(channelId, userId, status) {
    await this.joinCallRepository
      .insert({
        channelId: channelId,
        userId: userId,
        status: status,
      })
      .catch(console.error);
  }

  async updateJoiningDb(channelId, userId, status) {
    await this.joinCallRepository
      .createQueryBuilder()
      .update(JoinCall)
      .set({ status: status, end_time: Date.now() })
      .where(`"channelId" = :channelId`, { channelId: channelId })
      .andWhere(`"userId" = :userId`, { userId: userId })
      .execute();
    // .andWhere(`"status" = :status`, { status: status });
  }

  async voiceState(oldState: VoiceState, newState: VoiceState) {
    try {
      let countMember = newState.channel?.members.size
        ? newState.channel.members.size
        : oldState.channel.members.size;
      const allMember = newState.channel?.members
        ? newState.channel?.members
        : oldState.channel.members;

      if (countMember === 2 && newState.channelId) {
        const checkJoinMeeting = await this.voiceChannelsRepository.find({
          where: {
            status: "start",
            voiceChannelId: newState.channelId,
          },
        });

        checkJoinMeeting.map(async (item) => {
          await this.voiceChannelsRepository
            .createQueryBuilder()
            .update(VoiceChannels)
            .set({ status: "happening" })
            .where('"voiceChannelId" = :voiceChannelId', {
              voiceChannelId: item.voiceChannelId,
            })
            .execute()
            .catch(console.error);
        });
      }

      if (countMember < 2 && !newState.channelId) {
        const checkEndMeeting = await this.voiceChannelsRepository.find({
          where: {
            status: "happening",
            voiceChannelId: oldState.channelId,
          },
        });
        checkEndMeeting.map(async (item) => {
          await this.voiceChannelsRepository
            .createQueryBuilder()
            .update(VoiceChannels)
            .set({ status: "finished" })
            .where('"voiceChannelId" = :voiceChannelId', {
              voiceChannelId: item.voiceChannelId,
            })
            .execute()
            .catch(console.error);
          await oldState.channel.setName(`${item.originalName}`);
        });
      }

      // update user joining => finish when join new meeting
      // await this.joinCallRepository
      //   .createQueryBuilder()
      //   .update(JoinCall)
      //   .set({ status: "finished", end_time: Date.now() })
      //   .where('"userId" = :userId', {
      //     userId: newState.id,
      //   })
      //   .andWhere('"status" = :status', {
      //     status: "joining",
      //   })
      //   .execute()
      //   .catch(console.error);

      // !newState.channelId => leave room
      // !oldState.channelId => join room
      // one member leave when totals member = 2
      if (countMember === 1 && !newState.channelId) {
        await this.updateJoiningDb(oldState.channelId, oldState.id, "finish");
        const userid = oldState.channel.members.map((item) => item.user.id)[0];
        await this.updateJoiningDb(oldState.channelId, userid, "finish");
        console.log(userid, "userid");
      }
      // one member joinning hence total member = 2
      if (countMember === 2 && !oldState.channelId) {
        const userid = newState.channel.members.map((item) => item.user.id);
        await this.addJoinCall(newState.channelId, userid[0], "joining");
        await this.addJoinCall(newState.channelId, userid[1], "joining");
      }
      if (countMember === 2 && !newState.channelId) {
        await this.updateJoiningDb(oldState.channelId, oldState.id, "finish");
        console.log(oldState.id, "oldState.id");
      }
      if (countMember > 2) {
        if (!oldState.channelId) {
          await this.addJoinCall(newState.channelId, newState.id, "joining");
        }
        // check leave joinning
        if (!newState.channelId) {
          await this.updateJoiningDb(oldState.channelId, oldState.id, "finish");
        }
      }

      if (newState.selfVideo) {
        await this.checkCameraRepository
          .insert({
            userId: newState.id,
            channelId: newState.channelId,
            enableCamera: true,
            createdTimestamp: Date.now(),
          })
          .catch(console.error);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
