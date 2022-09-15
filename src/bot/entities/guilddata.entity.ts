import { Column, Entity } from "typeorm";
import { TABLE } from "../constants/table";

@Entity(TABLE.GUILDDATA)
class welcome {
  readonly status: false;
  readonly message: null;
  readonly channel: null;
  readonly image: false;
}
class goodbye {
  readonly status: false;
  readonly message: null;
  readonly channel: null;
  readonly image: false;
}
class autoping {
  readonly status: false;
  readonly message: null;
  readonly channel: null;
  readonly image: false;
}

class anti_maj {
  readonly status: false;
  readonly message: null;
  readonly channel: null;
  readonly image: false;
}
class anti_spam {
  readonly status: false;
  readonly message: null;
  readonly channel: null;
  readonly image: false;
}
class anti_mentions {
  readonly status: false;
  readonly message: null;
  readonly channel: null;
  readonly image: false;
}
class anti_dc {
  readonly status: false;
  readonly message: null;
  readonly channel: null;
  readonly image: false;
}

export class Channel {
  @Column({ default: null, nullable: true })
  serverID: string;

  @Column({ default: null, nullable: true })
  prefix: string;

  @Column({ default: "en".toLowerCase(), nullable: true })
  lang: string;

  @Column({ default: null, nullable: true })
  premium: string;

  @Column({ default: null, nullable: true })
  premiumUserID: string;

  @Column({ default: null, nullable: true })
  chatbot: string;

  @Column({ default: null, nullable: true })
  ignored_channel: string;

  @Column({ default: null, nullable: true })
  admin_role: string;

  @Column({ default: null, nullable: true })
  goodPremium: string;

  @Column({ default: null, nullable: true })
  requestChannel: string;

  @Column({ default: null, nullable: true })
  requestMessage: string;

  @Column({ default: 60, nullable: true })
  defaultVolume: string;

  @Column({ default: null, nullable: true })
  vc: string;
  @Column({ default: null, nullable: true })
  clearing: string;

  @Column({ default: null, nullable: true })
  auto_shuffle: string;

  @Column({ default: null, nullable: true })
  games_enabled: string;

  @Column({ default: true, nullable: false })
  util_enabled: string;

  @Column({ default: null, nullable: true })
  autorole: string;

  @Column({ default: null, nullable: true })
  autorole_bot: string;

  @Column({ default: null, nullable: true })
  dj_role: string;

  @Column({ default: null, nullable: true })
  count: string;

  @Column({ default: null, nullable: true })
  autopost: string;

  @Column({ default: null, nullable: true })
  suggestions: string;

  @Column({ default: "#3A871F", nullable: true })
  color: string;

  @Column({ default: false, nullable: true })
  backlist: string;

  @Column({ default: null, nullable: true })
  autonick: string;

  @Column({ default: null, nullable: true })
  autonick_bot: string;

  @Column({ default: null, nullable: true })
  autoplay: string;

  @Column({ default: null, nullable: true })
  song: string;

  @Column({ default: null, nullable: true })
  h24: string;

  @Column({ default: true, nullable: true })
  announce: string;

  @Column({ default: { welcome, goodbye, autoping } })
  plugins: object;

  @Column({
    default: {
      anti_maj,
      anti_spam,
      anti_mentions,
      anti_dc,
      anti_pub: null,
      antiraid_logs: null,
    },
  })
  protections: object;
}