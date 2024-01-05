import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  const { user_id, sort_by_vote } = (await request.json()) as {
    user_id: string;
    sort_by_vote: boolean;
  };

  const userSchema = z
    .object({
      user_id: z.string().cuid(),
      sort_by_vote: z.boolean(),
    })
    .strict();

  const zod = userSchema.safeParse({
    user_id,
    sort_by_vote,
  });

  if (!zod.success) {
    return NextResponse.json(zod.error, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        sort_by_vote,
      },
    });
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
