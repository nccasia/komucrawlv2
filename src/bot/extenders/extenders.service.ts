import { Injectable } from "@nestjs/common";
import { User } from "../models/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ExtendersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async addDB(displayName?: string, message?: any) {
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
    
  }
}
