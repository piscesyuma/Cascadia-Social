import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

/**
 * @swagger
 * /api/users:
 *   get:
 *     description: Returns user list
 *     responses:
 *       200:
 *         description: User List
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || undefined;
  const idSchema = z.string().cuid().optional();

  const zod = idSchema.safeParse(id);

  if (!zod.success) {
    return NextResponse.json(zod.error, { status: 400 });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id,
        },
      },

      orderBy: {
        created_at: "desc",
      },

      select: {
        id: true,
        name: true,
        screen_name: true,
        email: true,
        profile_image_url: true,
        following: true,
        reputations: true,
        followers: true,
        transactions: true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
