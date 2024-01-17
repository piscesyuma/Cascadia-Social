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

  if (user_id === session_owner_id) {
    return NextResponse.json({ message: "You can't vote for yourself!" });
  }

  try {
    const user = await findUser(user_id);

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

      const sessionUser = await findUser(session_owner_id);

      if (sessionUser) {
        await updateSessionUser(
          session_owner_id,
          sessionUser.reputation_count,
          -0.3,
        );
      }

      if (user && reputation.reputation_status === "up") {
        await decrementUserReputation(user_id, 1);
      } else if (user && reputation.reputation_status === "down") {
        await incrementUserReputation(user_id, 1);
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
          await incrementUserReputation(user_id, 2);
        } else if (opositeReputation.reputation_status === "up") {
          await decrementUserReputation(user_id, 2);
        }

        await prisma.reputation.delete({
          where: {
            id: opositeReputation.id,
          },
        });
      } else if (user) {
        if (reputation_status === "up") {
          await incrementUserReputation(user_id, 1);
        } else if (reputation_status === "down") {
          await decrementUserReputation(user_id, 1);
        }

        const sessionUser = await findUser(session_owner_id);

        if (sessionUser) {
          await updateSessionUser(
            session_owner_id,
            sessionUser.reputation_count,
            +0.3,
          );
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

async function findUser(id: string) {
  return prisma.user.findUnique({
    where: {
      id: id,
    },
  });
}

async function updateSessionUser(
  session_owner_id: string,
  reputation_count: number,
  changeReputationAmount: number,
) {
  await prisma.user.update({
    where: {
      id: session_owner_id,
    },

    data: {
      reputation_count: {
        set:
          Math.round(
            (reputation_count + changeReputationAmount + Number.EPSILON) * 100,
          ) / 100,
      },
    },
  });
}

async function decrementUserReputation(id: string, count: number) {
  await prisma.user.update({
    where: {
      id: id,
    },

    data: {
      reputation_count: {
        decrement: count,
      },
    },
  });
}

async function incrementUserReputation(id: string, count: number) {
  await prisma.user.update({
    where: {
      id: id,
    },

    data: {
      reputation_count: {
        increment: count,
      },
    },
  });
}
