import {
  InjectDiscordClient,
  InteractionEventCollector,
  On,
  Once,
  UseCollectors,
} from "@discord-nestjs/core";
import { Injectable, Logger, UseGuards } from "@nestjs/common";
import { Client, Message, MessageReaction, User, VoiceState } from "discord.js";
import { BwlService } from "./bwl/bwl.service";
import { AppreciatedReactionCollector } from "./collectors/appreciated-reaction-collector";
import { ExtendersService } from "./extenders/extenders.service";
import { MessageFromUserGuard } from "./guards/message-from-user.guard";
import { UtilitiesService } from "./utilities/utilities.service";
import { VoiceStateService } from "./voice-state/voice-state.service";

@Injectable()
@InteractionEventCollector({ time: 15000 })
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly extendersService: ExtendersService,
    private readonly utilitiesService: UtilitiesService,
    private readonly voiceStateService: VoiceStateService,
    private readonly bwlService: BwlService
  ) {}

  @Once("ready")
  onReady() {
    this.logger.log("[KOMU] Ready");
  }

  @On("messageCreate")
  @UseGuards(MessageFromUserGuard)
  @UseCollectors(AppreciatedReactionCollector)
  async onMessage(message: Message): Promise<void> {
    try {
      const { client: t } = message;
      const displayname =
        message.member != null || message.member != undefined
          ? message.member.displayName
          : message.author.username;

      if (message.id != null) {
        this.extendersService.addDBMessage(null, message).catch(console.error);
      }
      if (message.author != null) {
        this.extendersService
          .addDBUser(displayname, message)
          .catch(console.error);
      }
    } catch (err) {
      console.log(err);
    }
  }

  @On("messageDelete")
  @UseGuards(MessageFromUserGuard)
  async onMessageDelete(message: Message): Promise<void> {
    try {
      this.extendersService.deleteDB(message);
    } catch (err) {
      console.log(err);
    }
  }

  @On("messageReactionAdd")
  async onMessageReactionAdd(
    messageReaction: MessageReaction,
    user: User
  ): Promise<void> {
    try {
      this.utilitiesService.reactionDB(messageReaction, user);
    } catch (err) {
      console.log(err);
    }
  }

  @On("voiceStateUpdate")
  async onVoiceStateUpdate(
    oldState: VoiceState,
    newState: VoiceState
  ): Promise<void> {
    try {
      this.voiceStateService.voiceState(oldState, newState);
    } catch (err) {
      console.log(err);
    }
  }

  @On("messageReactionRemove")
  async onMessageReactionRemove(
    messageReaction: MessageReaction,
    user: User
  ): Promise<void> {
    try {
      this.utilitiesService.reactionRemoveDB(messageReaction, user);
    } catch (err) {
      console.log(err);
    }
  }
}
