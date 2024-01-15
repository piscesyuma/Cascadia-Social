import { TwitterProfile } from "next-auth/providers/twitter";
import { generateFromEmail } from "unique-username-generator";

import { TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET } from "@/config";

export const twitter = {
  clientId: TWITTER_CLIENT_ID,
  clientSecret: TWITTER_CLIENT_SECRET,
  version: "2.0", // opt-in to Twitter OAuth 2.0
  allowDangerousEmailAccountLinking: true,
  async profile(profile: TwitterProfile) {
    console.log(profile);
    const name = generateFromEmail(profile.data.username, 5);
    return {
      id: profile.data.id,
      name: name,
      screen_name: profile.data.name,
      email: profile.data.username,
      image: profile.data.profile_image_url,
      twitter_id: profile.data.id,
      twitter_username: profile.data.username,
      twitter_email: profile.data.username,
    };
  },
};
