import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { tweet_id, user_id, vote_status } = (await request.json()) as {
    tweet_id: string;
    user_id: string;
    vote_status: string;
  };
  const voteSchema = z
    .object({
      tweet_id: z.string().cuid(),
      user_id: z.string().cuid(),
      vote_status: z.string(),
    })
    .strict();
  const zod = voteSchema.safeParse({ tweet_id, user_id, vote_status });
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
    const vote = await prisma.vote.findFirst({
      where: {
        tweet_id,
        user_id,
        vote_status,
      },
    });
    if (vote) {
      await prisma.vote.delete({
        where: {
          id: vote.id,
        },
      });
      if (tweet && vote.vote_status === "up") {
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
      } else if (tweet && vote.vote_status === "down") {
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
      return NextResponse.json({ message: "Tweet vote changed" });
    } else {
      const opositeVote = await prisma.vote.findFirst({
        where: {
          tweet_id,
          user_id,
          NOT: {
            vote_status,
          },
        },
      });
      await prisma.vote.create({
        data: {
          tweet_id,
          user_id,
          vote_status,
        },
      });
      if (tweet && opositeVote) {
        if (opositeVote.vote_status === "down") {
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
        } else if (opositeVote.vote_status === "up") {
          await prisma.tweet.update({
            where: {
              id: tweet_id,
            },
            data: {
              vote_count: {
                decrement: 2,
              },
            },
          });
        }
        await prisma.vote.delete({
          where: {
            id: opositeVote.id,
          },
        });
      } else if (tweet) {
        if (vote_status === "up") {
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
        } else if (vote_status === "down") {
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
        }
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
