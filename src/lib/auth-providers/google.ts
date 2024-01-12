import { GoogleProfile } from "next-auth/providers/google";

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "@/config";

export const google = {
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  async profile(profile: GoogleProfile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
    };
  },
};
