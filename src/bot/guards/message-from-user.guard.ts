import { DiscordGuard } from "@discord-nestjs/core";
import { Message, MessageReaction, User } from "discord.js";

export class MessageFromUserGuard implements DiscordGuard {
  canActive(event: "messageCreate", [message]: [Message]): boolean {
    return !message.author.bot;
  }
}

export class MessageReactionAddFromUserGuard implements DiscordGuard {
  canActive(
    event: "messageReactionAdd",
    [messageReaction, user]: [MessageReaction, User]
  ): boolean {
    return !user.bot;
  }
}
