import { SiweMessage } from "siwe";

import { prisma } from "@/lib/prisma";

export const crypto = {
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
};
