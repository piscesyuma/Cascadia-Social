import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";

import { prisma } from "@/lib/prisma";

import {
  credentials,
  crypto,
  discord,
  github,
  google,
  twitter,
} from "./auth-providers";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn(params) {
      const { account, user, profile } = params;

      if (account && account.provider === "crypto") {
        return "/";
      }

      const currentSession = await getServerSession(authOptions);

      const currentUserId = currentSession?.user.id as string;

      if (user.email && account && currentUserId) {
        // Fetch the user with this email
        const existingUser = await prisma.user.findUnique({
          where: { id: currentUserId },
        });

        // If the user exists update their discord_email
        if (existingUser?.id) {
          const currentUser: any = user;

          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              ...user,
              id: existingUser.id,
              email: existingUser.email,
              name: existingUser.name,
              screen_name: existingUser.screen_name || currentUser.screen_name,
              image: existingUser.image || currentUser.image,
              profile_image_url:
                existingUser.profile_image_url || currentUser.profile_image_url,
              profile_banner_url:
                existingUser.profile_banner_url ||
                currentUser.profile_banner_url,
            },
          });

          return "/";
        }
      }

      const isAllowedToSignIn = true;

      if (account && profile && account.provider === "discord") {
        const discordEmail = profile.email;
        // find user with discordEmail in the DB
        const existingUser = await prisma.user.findFirst({
          where: {
            discord_email: discordEmail,
          },
        });

        // if discordEmail is not same with normal email, use normal user
        if (existingUser) {
          user.email = existingUser.email;
        }
      }

      if (isAllowedToSignIn) {
        return true;
      } else {
        return false;
      }
    },

    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token?.id;
        session.user.name = token?.name;
        session.user.email = token?.email;
        session.user.role = token?.role;
        session.user.username = token?.screen_name;
        session.user.publicAddress = token?.publicAddress;
        session.user.profile_image_url = token?.profile_image_url;
      }
      return session;
    },

    async jwt({ token, user }) {
      const dbUser = await prisma.user.findFirst({
        where: { email: token?.email },
      });

      if (!dbUser) {
        token.id = user?.id;
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        username: dbUser.screen_name,
        publicAddress: dbUser.publicAddress,
        profile_image_url: dbUser.profile_image_url,
      };
    },
  },

  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    // error: "/auth/signin",
  },

  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider(google),
    GithubProvider(github),
    TwitterProvider(twitter),
    DiscordProvider(discord),
    CredentialsProvider(crypto),
    CredentialsProvider(credentials),
  ],
};
