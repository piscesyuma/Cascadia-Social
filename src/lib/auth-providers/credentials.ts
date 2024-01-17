import { CredentialInput, CredentialsConfig } from "next-auth/providers";

import { prisma } from "@/lib/prisma";

type UserCredentialsConfig<C extends Record<string, CredentialInput>> = Partial<
  Omit<CredentialsConfig<C>, "options">
> &
  Pick<CredentialsConfig<C>, "authorize" | "credentials">;

export const credentials: UserCredentialsConfig<{
  email: {
    label: string;
    type: string;
    placeholder: string;
  };
  password: {
    label: string;
    type: string;
  };
}> = {
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
};
