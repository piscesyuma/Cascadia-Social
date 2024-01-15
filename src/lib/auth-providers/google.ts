import { GoogleProfile } from "next-auth/providers/google";
import { generateFromEmail } from "unique-username-generator";

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "@/config";

export const google = {
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  allowDangerousEmailAccountLinking: true,
  async profile(profile: GoogleProfile) {
    const randomName = generateFromEmail(profile.email, 5);

    return {
      id: profile.sub,
      name: randomName,
      screen_name: profile.name,
      email: profile.email,
      image: profile.picture || "",
      google_id: profile.sub,
      google_username: profile.name,
      google_email: profile.email,
    };
  },
};
