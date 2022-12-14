import { InjectDiscordClient } from "@discord-nestjs/core";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "discord.js";
import * as downloader from "image-downloader";
import { join } from "path";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Bwl } from "../entities/bwl.entity";
import { Channel } from "../entities/channel.entity";
import { User } from "../entities/user.entity";

const mediaPath = join(__dirname, "../../..", "src/media/attachments/");
@Injectable()
export class BwlService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @InjectRepository(Bwl)
    private bwlRepository: Repository<Bwl>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>
  ) {}

  download_image(url: any, imagePath: any) {
    downloader
      .image({ url: url, dest: mediaPath + imagePath })
      .then(({ filename }) => {
        console.log("Saved to", filename);
      })
      .catch((err) => console.error(err));
  }

  async bwl(message: any, client: any) {
    try {
      const chid = message.channelId;
      const messageId = message.id;
      const guildId = message.guildId;

      const authorId = message.author.id;

      const links = [];
      message.embeds.forEach((embed) => {
        try {
          if (embed.type == "image") {
            const filename = uuidv4() + "_" + embed.url.split("/").pop();
            this.download_image(embed.url, filename);
            links.push(filename);
          }
        } catch (error) {
          console.error(error);
        }
      });
      message.attachments.forEach((attachment) => {
        try {
          if (
            attachment.contentType != null &&
            attachment.contentType.startsWith("image")
          ) {
            const imageLink = attachment.proxyURL;
            console.log("downloading attachment " + imageLink);
            const filename = uuidv4() + "_" + attachment.name;
            this.download_image(imageLink, filename);
            links.push(filename);
          }
        } catch (error) {
          console.error(error);
        }
      });

      if (links.length > 0) {
        const user = await this.userRepository.findOne({
          where: {
            userId: authorId,
          },
        });
        const channel = await this.channelRepository.findOne({
          where: {
            id: chid,
          },
        });
        await this.bwlRepository
          .insert({
            channel: channel,
            messageId: messageId,
            guildId: guildId,
            author: user,
            link: links,
            createdTimestamp: Date.now(),
          })
          .catch(console.error);
      }

      const datachk = await this.channelRepository
        .findOne({ where: { id: chid } })
        .catch(console.error);

      if (datachk) {
        await this.channelRepository
          .createQueryBuilder()
          .update(Channel)
          .set({ lastMessageId: client.channels.cache.get(chid).lastMessageId })
          .where(`"channelId" = :channelId`, { channelId: chid });
      } else {
        await this.channelRepository
          .insert({
            id: chid,
            name: client.channels.cache.get(chid).name,
            type: client.channels.cache.get(chid).type,
            nsfw: client.channels.cache.get(chid).nsfw,
            rawPosition: client.channels.cache.get(chid).rawPosition,
            lastMessageId: client.channels.cache.get(chid).lastMessageId,
            rateLimitPerUser: client.channels.cache.get(chid).rateLimitPerUser,
            parentId: client.channels.cache.get(chid).parentId,
          })
          .catch(console.error);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
