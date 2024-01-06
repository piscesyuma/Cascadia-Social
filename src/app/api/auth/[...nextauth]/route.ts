import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import { SiweMessage } from "siwe";

import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET,
} from "@/config";
import { prisma } from "@/lib/prisma";

const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn() {
      const isAllowedToSignIn = true;
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
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    }),
    TwitterProvider({
      clientId: TWITTER_CLIENT_ID,
      clientSecret: TWITTER_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: "crypto",
      name: "Crypto Wallet Auth",
      credentials: {
        message: { label: "Message", type: "text" },
        publicAddress: { label: "Public Address", type: "text" },
        signedNonce: { label: "Signed Nonce", type: "text" },
      },
      async authorize(
        credentials:
          | Record<"message" | "publicAddress" | "signedNonce", string>
          | undefined,
        // req: Pick<RequestInternal, "body" | "headers" | "method" | "query">,
      ) {
        if (!credentials) throw new Error("Invalid credentials");

        // Get user from database with their generated nonce
        const user = await prisma.user.findUnique({
          where: { publicAddress: credentials.publicAddress },
          include: { cryptoLoginNonce: true },
        });

        if (!user?.cryptoLoginNonce) throw new Error("Invalid Nonce");

        // Everything is fine, clear the nonce and return the user
        await prisma.cryptoLoginNonce.delete({ where: { userId: user.id } });

        // Compute the signer address from the saved nonce and the received signature
        const message: any = JSON.parse(credentials?.message);
        if (message.chainId && typeof message.chainId === "number") {
          const siwe = new SiweMessage(message);
          const result = await siwe.verify({
            signature: credentials.signedNonce,
            nonce: user.cryptoLoginNonce.nonce,
          });

          if (!result.success) throw new Error("Invalid Signature");

          // Check that the signer address matches the public address

          // Check that the nonce is not expired
          if (user.cryptoLoginNonce.expires < new Date())
            throw new Error("Expired Nonce");

          return user;
        } else if (typeof message.chainId === "string") {
          return user;
        } else {
          throw new Error("The wallet address is incorrect.");
        }
      },
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      id: "credentials",
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        try {
          const user = await prisma.user.findFirst({
            where: { email: credentials?.email },
          });

          // If no error and we have user data, return it
          if (user) {
            return user;
          } else {
            throw new Error("Invalid user");
          }
        } catch (error) {
          // Return null if user data could not be retrieved
          throw new Error("The username or password you entered is incorrect.");
        }
      },
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
