import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const initialUserBalance = 100;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id") || undefined;
  const type = searchParams.get("type") || undefined;

  const userIdSchema = z.string().cuid().optional();
  const zod = userIdSchema.safeParse(user_id);

  if (!zod.success) {
    return NextResponse.json(zod.error, { status: 400 });
  }

  try {
    if (type === "followers") {
      const followers = await prisma.user
        .findUnique({
          where: {
            id: user_id,
          },
        })
        .followers();
      return NextResponse.json(followers, { status: 200 });
    } else if (type === "following") {
      const following = await prisma.user
        .findUnique({
          where: {
            id: user_id,
          },
        })
        .following();

      return NextResponse.json(following, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { user_id, session_owner_id, amount } = (await request.json()) as {
    user_id: string;
    session_owner_id: string;
    amount: number;
  };

  const followerIdSchema = z
    .object({
      session_owner_id: z.string().cuid(),
      user_id: z.string().cuid(),
    })
    .strict();

  const zod = followerIdSchema.safeParse({ session_owner_id, user_id });

  if (!zod.success) {
    return NextResponse.json(zod.error, { status: 400 });
  }

  try {
    let buyerBalance = 0;
    let followerBalance = 0;
    let systemBalance = 0;

    // Get the last transaction of the buyer from the database
    const buyerLastTransaction = await prisma.transaction.findFirst({
      where: { user_id: session_owner_id },
      orderBy: { createdAt: "desc" },
    });

    // If last transaction of buyer does not exist, initialize balance
    if (buyerLastTransaction) {
      buyerBalance = buyerLastTransaction.balance;
    } else {
      buyerBalance = initialUserBalance;
    }

    // Check if amount is available
    if (buyerBalance < amount) {
      return NextResponse.json(
        {
          message: "Amount of transaction is unavailable.",
        },
        {
          status: 400,
        },
      );
    }

    // Add a buyer transaction
    await processTransaction(
      session_owner_id,
      user_id,
      buyerBalance - amount,
      amount,
      "Buying",
    );

    // Get the last transaction of the follower from the database
    const followerLastTransaction = await prisma.transaction.findFirst({
      where: { user_id: user_id },
      orderBy: { createdAt: "desc" },
    });

    if (followerLastTransaction) {
      followerBalance = followerLastTransaction.balance;
    } else {
      followerBalance = initialUserBalance;
    }

    // Add a follower transaction
    await processTransaction(
      user_id,
      session_owner_id,
      followerBalance + amount * 0.5,
      amount * 0.5,
    );

    // Get the last transaction of the system from the database
    const followerSystemTransaction = await prisma.transaction.findFirst({
      where: { user_id: "Cascadia" },
      orderBy: { createdAt: "desc" },
    });

    if (followerSystemTransaction) {
      systemBalance = followerSystemTransaction.balance;
    }

    // Add a follower transaction
    await processTransaction(
      "Cascadia",
      session_owner_id,
      systemBalance + amount * 0.5,
      amount * 0.5,
      // `Buying: ${session_owner_id} => ${user_id}`,
    );

    // Increase buyer's followers count
    await updateUserFollowerCount(session_owner_id, 1);

    await prisma.user.update({
      where: {
        id: session_owner_id,
      },

      data: {
        followers: {
          connect: {
            id: user_id,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Purchased",
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.log("error", error.message);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);

  const user_id = searchParams.get("user_id") || undefined;
  const session_owner_id = searchParams.get("session_owner_id") || undefined;

  const followerIdSchema = z
    .object({
      user_id: z.string().cuid(),
      session_owner_id: z.string().cuid(),
    })
    .strict();

  const zod = followerIdSchema.safeParse({ user_id, session_owner_id });

  if (!zod.success) {
    return NextResponse.json(zod.error, { status: 400 });
  }

  try {
    await prisma.user.update({
      where: {
        id: user_id,
      },

      data: {
        followers: {
          disconnect: {
            id: session_owner_id,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Unfollowed",
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

// Update user's follower count
const updateUserFollowerCount = async (
  userId: string,
  numberOfFollowers: number,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { followers_count: true },
  });

  if (user) {
    const newFollowerCount = user.followers_count + numberOfFollowers;
    await prisma.user.update({
      where: { id: userId },
      data: {
        followers_count: newFollowerCount,
      },
    });
  }
};

const processTransaction = async (
  buyerId: string,
  followerId: string,
  balance: number,
  amount: number,
  description = "",
) => {
  const transaction = await prisma.transaction.create({
    data: {
      user_id: buyerId,
      follower_id: followerId,
      balance: balance,
      amount: amount,
      description: description,
      createdAt: new Date(),
    },
  });

  return transaction;
};
