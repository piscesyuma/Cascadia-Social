import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id") || undefined;

  const userIdSchema = z.string().cuid();
  const zod = userIdSchema.safeParse(user_id);

  if (!zod.success) {
    return NextResponse.json(
      {
        message: "Invalid request body",
        error: zod.error.formErrors,
      },
      { status: 400 },
    );
  }

  try {
    const tweets = await prisma.tweet.findMany({
      where: {
        upvotes: {
          some: {
            user_id,
          },
        },
      },

      include: {
        author: true,
        media: true,
        upvotes: true,
        retweets: true,
        comments: true,
      },
    });

    return NextResponse.json(tweets, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error.message,
      },
      { status: error.errorCode || 500 },
    );
  }
}

export async function POST(request: Request) {
  const { tweet_id, user_id } = (await request.json()) as {
    tweet_id: string;
    user_id: string;
  };

  const upvoteSchema = z
    .object({
      tweet_id: z.string().cuid(),
      user_id: z.string().cuid(),
    })
    .strict();

  const zod = upvoteSchema.safeParse({ tweet_id, user_id });

  if (!zod.success) {
    return NextResponse.json(
      {
        message: "Invalid request body",
        error: zod.error.formErrors,
      },
      { status: 400 },
    );
  }

  try {
    const tweet = await prisma.tweet.findUnique({
      where: {
        id: tweet_id,
      },
    });

    const upvote = await prisma.upvote.findFirst({
      where: {
        tweet_id,
        user_id,
      },
    });

    if (upvote) {
      await prisma.upvote.delete({
        where: {
          id: upvote.id,
        },
      });

      if (tweet && tweet.vote_count > 0)
        await prisma.tweet.update({
          where: {
            id: tweet_id,
          },

          data: {
            vote_count: {
              decrement: 1,
            },
          },
        });

      return NextResponse.json({ message: "Tweet unupvoted" });
    } else {
      await prisma.upvote.create({
        data: {
          tweet_id,
          user_id,
        },
      });

      const downvote = await prisma.downvote.findFirst({
        where: {
          tweet_id,
          user_id,
        },
      });

      if (tweet && downvote) {
        await prisma.downvote.delete({
          where: {
            id: downvote.id,
          },
        });

        await prisma.tweet.update({
          where: {
            id: tweet_id,
          },

          data: {
            vote_count: {
              increment: 2,
            },
          },
        });
      } else if (tweet) {
        await prisma.tweet.update({
          where: {
            id: tweet_id,
          },

          data: {
            vote_count: {
              increment: 1,
            },
          },
        });
      }

      return NextResponse.json({ message: "Tweet upvoted" });
    }
  } catch (error: any) {
    return NextResponse.json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}
