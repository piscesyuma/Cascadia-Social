import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { user_id, session_owner_id, reputation_status } =
    (await request.json()) as {
      user_id: string;
      session_owner_id: string;
      reputation_status: string;
    };

  const reputationSchema = z
    .object({
      user_id: z.string().cuid(),
      session_owner_id: z.string().cuid(),
      reputation_status: z.string(),
    })
    .strict();

  const zod = reputationSchema.safeParse({
    user_id,
    session_owner_id,
    reputation_status,
  });

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
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    const reputation = await prisma.reputation.findFirst({
      where: {
        user_id,
        session_owner_id,
        reputation_status,
      },
    });

    if (reputation) {
      await prisma.reputation.delete({
        where: {
          id: reputation.id,
        },
      });

      if (user && reputation.reputation_status === "up") {
        await prisma.user.update({
          where: {
            id: user_id,
          },

          data: {
            reputation_count: {
              decrement: 1,
            },
          },
        });
      } else if (user && reputation.reputation_status === "down") {
        await prisma.user.update({
          where: {
            id: user_id,
          },

          data: {
            reputation_count: {
              increment: 1,
            },
          },
        });
      }

      return NextResponse.json({ message: "User reputation changed" });
    } else {
      const opositeReputation = await prisma.reputation.findFirst({
        where: {
          user_id,
          session_owner_id,
          NOT: {
            reputation_status,
          },
        },
      });

      await prisma.reputation.create({
        data: {
          user_id,
          session_owner_id,
          reputation_status,
        },
      });

      if (user && opositeReputation) {
        if (opositeReputation.reputation_status === "down") {
          await prisma.user.update({
            where: {
              id: user_id,
            },

            data: {
              reputation_count: {
                increment: 2,
              },
            },
          });
        } else if (opositeReputation.reputation_status === "up") {
          await prisma.user.update({
            where: {
              id: user_id,
            },

            data: {
              reputation_count: {
                decrement: 2,
              },
            },
          });
        }

        await prisma.reputation.delete({
          where: {
            id: opositeReputation.id,
          },
        });
      } else if (user) {
        if (reputation_status === "up") {
          await prisma.user.update({
            where: {
              id: user_id,
            },

            data: {
              reputation_count: {
                increment: 1,
              },
            },
          });
        } else if (reputation_status === "down") {
          await prisma.user.update({
            where: {
              id: user_id,
            },

            data: {
              reputation_count: {
                decrement: 1,
              },
            },
          });
        }
      }

      return NextResponse.json({ message: "User reputation changed" });
    }
  } catch (error: any) {
    return NextResponse.json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}
