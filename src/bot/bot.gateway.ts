import {
  InjectDiscordClient,
  InteractionEventCollector,
  On,
  Once,
  UseCollectors,
  UseGuards,
  UsePipes,
} from "@discord-nestjs/core";
import { Injectable, Logger } from "@nestjs/common";
import { Client, Message, MessageReaction, User } from "discord.js";
import { AppreciatedReactionCollector } from "./collectors/appreciated-reaction-collector";
import { ExtendersService } from "./extenders/extenders.service";
import { MessageFromUserGuard } from "./guards/message-from-user.guard";
import { MessageToUpperPipe } from "./pipes/message-to-upper.pipe";

@Injectable()
@InteractionEventCollector({ time: 15000 })
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly extendersService: ExtendersService
  ) {}

  @Once("ready")
  onReady() {
    this.logger.log("[KOMU] Ready");
  }

  @On("messageCreate")
  @UseGuards(MessageFromUserGuard)
  // @UsePipes(MessageToUpperPipe)
  @UseCollectors(AppreciatedReactionCollector)
  async onMessage(message: Message): Promise<void> {
    try {
      const displayname =
        message.member != null || message.member != undefined
          ? message.member.displayName
          : message.author.username;

      if (message.id != null && message.content != "") {
        this.extendersService.addDBMessage(null, message).catch(console.error);
      }
      if (message.author != null) {
        this.extendersService
          .addDBUser(displayname, message)
          .catch(console.error);
      }
      // await message.reply(`${displayname}`);
    } catch (err) {
      console.log(err);
    }
  }

  @On("messageDelete")
  @UseGuards(MessageFromUserGuard)
  // @UsePipes(MessageToUpperPipe)
  async onMessageDelete(message: Message): Promise<void> {
    try {
      this.extendersService.deleteDB(message);
    } catch (err) {
      console.log(err);
    }
  }

  @On("messageReactionAdd")
  // @UsePipes(MessageToUpperPipe)
  async onMessageReactionAdd(
    messageReaction: MessageReaction,
    user: User
  ): Promise<void> {
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
      // while (channel.type !== "GUILD_CATEGORY") {
      //   channel = await message.client.channels.fetch(channel.parentId);
      // }

      // const checkCategories = [
      //   "PROJECTS",
      //   "PROJECTS-EXT",
      //   "PRODUCTS",
      //   "LOREN",
      //   "HRM&IT",
      //   "SAODO",
      //   "MANAGEMENT",
      // ];

      // let validCategory;
      // if (channel.name.slice(0, 4).toUpperCase() === "PRJ-") {
      //   validCategory = true;
      // } else {
      //   validCategory = checkCategories.includes(channel.name.toUpperCase());
      // }
    } catch (err) {
      console.log(err);
    }
  }
}
