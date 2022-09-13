import { Injectable } from "@nestjs/common";
import { User } from "../models/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "../models/msg.entity";
import { Mentioned } from "../models/mentioned.entity";

@Injectable()
export class ExtendersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Mentioned) private mentionedRepository: Repository<Mentioned>,
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

      const date = Date.now();
      await this.mentionedRepository
      .createQueryBuilder()
      .update(Mentioned)
      .set({ confirm: true, reactionTimestamp: null })
      .where("channelId = :channelId", { channelId: message.channelId })
      .andWhere("mentionUserId = :mentionUserId", { mentionUserId: message.author.id })
      .andWhere("confirm = :confirm", { confirm: false })
      .andWhere("reactionTimestamp = :reactionTimestamp", { reactionTimestamp: null })
      .execute();
  }
}
