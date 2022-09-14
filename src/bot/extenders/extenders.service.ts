import { Injectable } from "@nestjs/common";
import { User } from "../models/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "../models/msg.entity";
import { Mentioned } from "../models/mentioned.entity";
import { checkTime } from "../untils/formatDateTime";
import { InjectDiscordClient } from "@discord-nestjs/core";
import { Client } from "discord.js";

@Injectable()
export class ExtendersService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Mentioned)
    private mentionedRepository: Repository<Mentioned>
  ) {}

  async addDBUser(displayName?: string, message?: any) {
    const findUser = await this.userRepository.findOne({
      where: { userId: message.author.id },
    });

    if (findUser) {
      findUser.userId = message.author.id;
      findUser.username = message.author.username;
      findUser.discriminator = message.author.discriminator;
      findUser.avatar = message.author.avatar;
      findUser.bot = message.author.bot;
      findUser.system = message.author.system;
      findUser.banner = message.author.banner;
      findUser.email = displayName;
      findUser.flags = message.author.flags;
      findUser.premium_type = message.author.premium_type;
      findUser.public_flags = message.author.public_flags;
      await this.userRepository.save(findUser);
      return;
    }

    const komuUser = {
      userId: message.author.id,
      username: message.author.username,
      discriminator: message.author.discriminator,
      avatar: message.author.avatar,
      bot: message.author.bot,
      system: message.author.system,
      banner: message.author.banner,
      email: displayName,
      flags: message.author.flags,
      premium_type: message.author.premium_type,
      public_flags: message.author.public_flags,
    };

    await this.userRepository.insert(komuUser);
  }

  async deleteDB(message?: any) {}

  async addDBMessage(_, message?: any) {
    const data = {
      channelId: message.channelId,
      guildId: message.guildId,
      deleted: message.deleted,
      messageId: message.id,
      createdTimestamp: message.createdTimestamp,
      type: message.type,
      system: message.system,
      content: message.content,
      author: message.author.id,
      pinned: message.pinned,
      tts: message.tts,
      nonce: message.nonce,
      editedTimestamp: message.editedTimestamp,
      webhookId: message.webhookId,
      applicationId: message.applicationId,
      flags: message.flags,
    };

    await this.messageRepository.insert(data);

    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ last_message_id: message.id })
      .where("userId = :userId", { userId: message.author.id })
      .andWhere(`deactive IS NOT true`)
      .execute();

    await this.mentionedRepository
      .createQueryBuilder()
      .update(Mentioned)
      .set({ confirm: true, reactionTimestamp: "test" })
      .where("channelId = :channelId", { channelId: message.channelId })
      .andWhere("mentionUserId = :mentionUserId", {
        mentionUserId: message.author.id,
      })
      .andWhere("confirm = :confirm", { confirm: false })
      .andWhere("reactionTimestamp = :reactionTimestamp", {
        reactionTimestamp: null,
      })
      .execute();

    let channel = await message.client.channels.fetch(message.channelId);

    if (channel.type === "DM") return data;

    if (channel.type !== "GUILD_CATEGORY") {
      channel = await message.client.channels.fetch(channel.parentId);
    }

    const checkCategories: string[] = [
      "PROJECTS",
      "PROJECTS-EXT",
      "PRODUCTS",
      "LOREN",
      "HRM&IT",
      "SAODO",
      "MANAGEMENT",
      "MOVE CHANNEL",
    ];

    let validCategory: boolean = false;
    if (channel.name.slice(0, 4).toUpperCase() === "PRJ-") {
      validCategory = true;
    } else {
      validCategory = checkCategories.includes(channel.name.toUpperCase());
    }

    // if (!checkTime(new Date())) return;

    const clientRoleId = "1016915402347008010";
    const role = await message.guild.roles.fetch(clientRoleId);
    let includeClient: boolean = false;
    if (role) {
      includeClient = role.members.some(
        (member) => member.id === message.author.id
      );
    }

    if (
      message.mentions &&
      message.mentions.users &&
      message.mentions.users.size !== 0 &&
      message.author.id !== "922003239887581205" &&
      validCategory &&
      !includeClient &&
      message.channelId !== "921339190090797106" &&
      message.type !== "REPLY"
    ) {
      const uniqueUsers = message.mentions.users.reduce((prev, current) => {
        const exists = prev.find((user) => user.id === current.id);

        if (!exists) {
          prev.push(current);
        }

        return prev;
      }, []);

      uniqueUsers
        .filter((user) => user.id !== "922003239887581205")
        .forEach(async (user) => {
          let tagClient = false;
          if (role) {
            tagClient = role.members.some((member) => member.id === user.id);
          }

          const getChannels = await message.guild.channels.fetch(
            message.channelId
          );
          let includeChannel = false;
          if (getChannels && getChannels.members && getChannels.members.some) {
            includeChannel = getChannels.members.some(
              (member) => member.id === user.id
            );
          }

          if (!tagClient && includeChannel) {
            const data = {
              messageId: message.id,
              authorId: message.author.id,
              channelId: message.channelId,
              mentionUserId: user.id,
              createdTimestamp: message.createdTimestamp,
              noti: false,
              confirm: false,
              punish: false,
              reactionTimestamp: null,
            };

            await this.mentionedRepository.insert(data);
          }
        });
    }
    return data;
  }
}
