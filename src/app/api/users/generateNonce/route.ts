import crypto from "crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

// Generating a nonce is the first step of both registering and logging in.
//  In this function we generate a secure random string and assign it to
//  the public address that we get as a parameter.
// We save this to the database so if we don't have a user with the given
//  public address, we create a new user.
// Later steps of both logging in and registering require the user to sign
//  the nonce we send back, with that they prove that they are the owners
//  of the public address they gave.
export async function POST(request: Request) {
  const { name, email, publicAddress } = (await request.json()) as {
    name: string;
    email: string;
    publicAddress: string;
  };

  const useSchema = z
    .object({
      publicAddress: z.string(),
    })
    .strict();

  const zod = useSchema.safeParse({ publicAddress });

  if (!zod.success) {
    return NextResponse.json(zod.error, { status: 400 });
  }

  try {
    const where = name && email ? { name, email } : { publicAddress };

    const user = await prisma.user.findUnique({ where });

    if (!user)
      return NextResponse.json("Unregisterd wallet address", { status: 402 });

    // Note: this nonce is displayed in the user's wallet for them to sign
    //  you can use any other representation of the nonce that you want
    //  but make sure to keep it a true random number with enough length.
    const nonce = crypto.randomBytes(32).toString("hex");

    // Set the expiry of the nonce to 1 hour
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60);

    // Create or update the nonce for the given user
    await prisma.user.upsert({
      where,
      create: {
        name,
        publicAddress,
        cryptoLoginNonce: {
          create: {
            nonce,
            expires,
          },
        },
      },
      update: {
        publicAddress,
        cryptoLoginNonce: {
          upsert: {
            create: {
              nonce,
              expires,
            },
            update: {
              nonce,
              expires,
            },
          },
        },
      },
    });
    return NextResponse.json(
      {
        nonce,
        expires: expires.toISOString(),
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
