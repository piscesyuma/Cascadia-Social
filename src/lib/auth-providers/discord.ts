import { DiscordProfile } from "next-auth/providers/discord";
import { generateFromEmail } from "unique-username-generator";

import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from "@/config";

export const discord = {
  clientId: DISCORD_CLIENT_ID,
  clientSecret: DISCORD_CLIENT_SECRET,
  allowDangerousEmailAccountLinking: true,
  async profile(profile: DiscordProfile) {
    const name = generateFromEmail(profile.email, 5);

    const image = profile.avatar
      ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.webp?size=32`
      : "";
    const profile_image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.webp?size=128`;

    const profile_banner_url = profile.banner
      ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.banner}.webp`
      : "";

    return {
      id: profile.id,
      name: name,
      screen_name: profile.global_name,
      email: profile.email,
      image,
      profile_image_url,
      profile_banner_url,
      discord_id: profile.id,
      discord_username: profile.username,
      discord_email: profile.email,
    };
  },
};
