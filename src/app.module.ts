import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GatewayIntentBits } from "discord.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as Joi from "@hapi/joi";
import { BotGateway } from "./bot/bot.gateway";
import { ExtendersService } from "./bot/extenders/extenders.service";
import { User } from "./bot/entities/user.entity";
import { Mentioned } from "./bot/entities/mentioned.entity";
import { BwlService } from "./bot/bwl/bwl.service";
import { UtilitiesService } from "./bot/utilities/utilities.service";
import { Channel } from "./bot/entities/channel.entity";
import { Bwl } from "./bot/entities/bwl.entity";
import { BwlReaction } from "./bot/entities/bwlReaction.entity";
import { Msg } from "./bot/entities/msg.entity";
import { VoiceChannels } from "./bot/entities/voiceChannels.entity";
import { JoinCall } from "./bot/entities/joinCall.entity";
import { VoiceStateService } from "./bot/voice-state/voice-state.service";
import { CheckCamera } from "./bot/entities/checkCamera.entity";
import { WorkFromHome } from "./bot/entities/wfh.entity";
import { TX8 } from "./bot/entities/tx8.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        TOKEN: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("POSTGRES_HOST"),
        port: configService.get("POSTGRES_PORT"),
        username: configService.get("POSTGRES_USER"),
        password: configService.get("POSTGRES_PASSWORD"),
        database: configService.get("POSTGRES_DB"),
        // entities: [__dirname + '/../**/*.entity.ts'],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([
      User,
      Msg,
      Mentioned,
      Channel,
      Bwl,
      BwlReaction,
      VoiceChannels,
      JoinCall,
      CheckCamera,
      WorkFromHome,
      TX8,
    ]),
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get("TOKEN"),
        discordClientOptions: {
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.MessageContent,
            // You must allow message content for your application in discord developers
            // https://support-dev.discord.com/hc/en-us/articles/4404772028055
          ],
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    BotGateway,
    ExtendersService,
    BwlService,
    UtilitiesService,
    VoiceStateService,
  ],
})
export class AppModule {}
