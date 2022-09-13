import {
  InjectDiscordClient,
  On,
  Once,
  UseGuards,
  UsePipes,
} from "@discord-nestjs/core";
import { Injectable, Logger } from "@nestjs/common";
import { Client, Message, MessageReaction, User } from "discord.js";
import { ExtendersService } from "./extenders/extenders.service";
// import { ExtendersService } from "./extenders/extenders.service";

import {
  MessageFromUserGuard,
  MessageReactionAddFromUserGuard,
} from "./guards/message-from-user.guard";
import { MessageToUpperPipe } from "./pipes/message-to-upper.pipe";

@Injectable()
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
  @UsePipes(MessageToUpperPipe)
  async onMessage(message: Message): Promise<void> {
    try {
      const displayname =
        message.member != null || message.member != undefined
          ? message.member.displayName
          : message.author.username;

      if (message.id != null && message.content != "") {
        this.extendersService.addDB(null, message).catch(console.error);
      }
      if (message.author != null) {
        this.extendersService.addDB(displayname, message).catch(console.error);
      }
      // await message.reply(`${displayname}`);
    } catch (err) {
      console.log(err);
    }
  }

  @On("messageDelete")
  @UseGuards(MessageFromUserGuard)
  @UsePipes(MessageToUpperPipe)
  async onMessageDelete(message: Message): Promise<void> {
    try {
      this.extendersService.deleteDB(message);
    } catch (err) {
      console.log(err);
    }
  }

  @On("messageReactionAdd")
  @UseGuards(MessageReactionAddFromUserGuard)
  @UsePipes(MessageToUpperPipe)
  async onMessageReactionAdd(
    messageReaction: MessageReaction,
    user: User
  ): Promise<void> {
    try {
      console.log("message", messageReaction);
      // const { message, emoji } = messageReaction;
      // const chid = message.channel.id;
      // const messageId = message.id;
      // const guildId = message.guildId;
      // const createdTimestamp = message.createdTimestamp;
      // let channel = message.channel;

      // console.log(message, "message");
      // console.log(emoji, "emoji");
      // console.log(chid);
      // console.log(messageId);
      // console.log(guildId);
      // console.log(createdTimestamp);

      // if (!message.guildId) return;
    } catch (err) {
      console.log(err);
    }
  }
}
