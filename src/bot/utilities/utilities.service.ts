import { InjectDiscordClient } from "@discord-nestjs/core";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "discord.js";
import { BwlReaction } from "src/bot/entities/bwlReaction.entity";
import { Mentioned } from "src/bot/entities/mentioned.entity";
import { Repository } from "typeorm";

@Injectable()
export class UtilitiesService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @InjectRepository(Mentioned)
    private mentionedRepository: Repository<Mentioned>,
    @InjectRepository(BwlReaction)
    private bwlReactionRepository: Repository<BwlReaction>
  ) {}

  async reactionDB(messageReaction: any, user: any) {
    try {
      const { message, emoji } = messageReaction;
      const chid = message.channel.id;
      const messageId = message.id;
      const guildId = message.guildId;
      const createdTimestamp = message.createdTimestamp;
      let channel = message.channel;

      if (!message.guildId) return;

      const fetchMessage = await message.client.channels.fetch(
        message.channelId
      );

      const msg = await (fetchMessage as any).messages.fetch(message.id);
      if ((channel as any).type !== "GUILD_CATEGORY") {
        (channel as any) = await message.client.channels.fetch(
          (channel as any).parentId
        );
      }

      const checkCategories = [
        "PROJECTS",
        "PROJECTS-EXT",
        "PRODUCTS",
        "LOREN",
        "HRM&IT",
        "SAODO",
        "MANAGEMENT",
        "MOVE CHANNEL",
      ];

      let validCategory;
      if ((channel as any).name.slice(0, 4).toUpperCase() === "PRJ-") {
        validCategory = true;
      } else {
        validCategory = checkCategories.includes(
          (channel as any).name.toUpperCase()
        );
      }

      if (
        validCategory &&
        message.channelId !== "921339190090797106" &&
        msg.author.id != "922003239887581205"
      ) {
        const userDiscord = await message.client.users.fetch(msg.author.id);
        userDiscord.send(
          `${user.username} react ${emoji.name} on your comment ${message.url}`
        );
      }

      const resolveMention = message.mentions.users.find(
        (current) => current.id === user.id
      );

      if (resolveMention) {
        await this.mentionedRepository
          .createQueryBuilder()
          .update(Mentioned)
          .set({ confirm: true, reactionTimestamp: Date.now() })
          .where(`"messageId" = :messageId`, { messageId: messageId })
          .where(`"mentionUserId" = :mentionUserId`, { mentionUserId: user.id })
          .where(`"reactionTimestamp" IS NULL`)
          .execute();
      }

      const dataBwl = await this.bwlReactionRepository.findOne({
        where: {
          authorId: user.id,
          messageId: messageId,
          guildId: guildId,
          channelId: chid,
        },
      });

      if (dataBwl != null) {
        await this.bwlReactionRepository
          .createQueryBuilder()
          .update(BwlReaction)
          .set({ count: dataBwl.count + 1 })
          .where("id = :id", { id: dataBwl.id })
          .execute();
        return;
      }

      const createBwl = {
        channelId: chid,
        guildId: guildId,
        messageId: messageId,
        authorId: user.id,
        emoji: emoji.name,
        count: 1,
        createdTimestamp: createdTimestamp,
      };

      await this.bwlReactionRepository.insert(createBwl);
    } catch (error) {}
  }
}
