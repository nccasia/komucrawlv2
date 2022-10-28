import { Injectable } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Msg } from "../entities/msg.entity";
import { Mentioned } from "../entities/mentioned.entity";
import { checkTime } from "../utilities/formatDateTime";
import { InjectDiscordClient } from "@discord-nestjs/core";
import { ChannelType, Client, MessageType } from "discord.js";
import { Channel } from "../entities/channel.entity";

@Injectable()
export class ExtendersService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(Msg) private msgRepository: Repository<Msg>,
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

  async deleteDB(message?: any) {
    await this.mentionedRepository.delete({ messageId: message.id });
  }

  async addDBMessage(_, message?: any) {
    const user = await this.userRepository.findOne({
      where: {
        userId: message.author.id,
      },
    });
    const channelInsert = await this.channelRepository.findOne({
      where: {
        id: message.channelId,
      },
    });
    const data = {
      id: message.id,
      channel: channelInsert,
      guildId: message.guildId,
      deleted: message.deleted,
      createdTimestamp: message.createdTimestamp,
      type: message.type,
      system: message.system,
      content: message.content,
      author: user,
      pinned: message.pinned,
      tts: message.tts,
      nonce: message.nonce,
      editedTimestamp: message.editedTimestamp,
      webhookId: message.webhookId,
      applicationId: message.applicationId,
      flags: message.flags,
    };

    await this.msgRepository.insert(data);

    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ last_message_id: message.id })
      .where('"userId" = :userId', { userId: message.author.id })
      .andWhere(`deactive IS NOT True`)
      .execute()
      .catch(console.error);

    await this.mentionedRepository
      .createQueryBuilder()
      .update(Mentioned)
      .set({ confirm: true, reactionTimestamp: Date.now() })
      .where(`"channelId" = :channelId`, { channelId: message.channelId })
      .andWhere(`"mentionUserId" = :mentionUserId`, {
        mentionUserId: message.author.id,
      })
      .andWhere(`"confirm" = :confirm`, { confirm: false })
      .andWhere(`"reactionTimestamp" IS NULL`)
      .execute()
      .catch(console.error);

    let channel = await message.client.channels.fetch(message.channelId);

    if (channel.type === ChannelType.DM) return data;

    if (
      channel.type === ChannelType.GuildPublicThread ||
      channel.type === ChannelType.GuildPrivateThread
    ) {
      const channelParent = await message.client.channels.fetch(
        channel.parentId
      );
      channel = await message.client.channels.fetch(channelParent.parentId);
    } else if (channel.type === ChannelType.GuildText) {
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
    ];

    let validCategory: boolean = false;
    if (channel.name.slice(0, 4).toUpperCase() === "PRJ-") {
      validCategory = true;
    } else {
      validCategory = checkCategories.includes(channel.name.toUpperCase());
    }

    if (!checkTime(new Date())) return;

    const clientRoleId = "921797855373574185";
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
      message.type !== MessageType.Reply
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

          let getChannels = await message.client.channels.fetch(
            message.channelId
          );

          if (
            getChannels.type === ChannelType.GuildPublicThread ||
            channel.type === ChannelType.GuildPrivateThread
          ) {
            getChannels = await message.client.channels.fetch(
              getChannels.parentId
            );
          }

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
