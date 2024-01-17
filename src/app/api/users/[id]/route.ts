import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: {
    params: {
      id: string;
    };
  },
) {
  const { id } = context.params;

  const idSchema = z.string().cuid();
  const zod = idSchema.safeParse(id);

  if (!zod.success) {
    return NextResponse.json(zod.error, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        name: true,
        screen_name: true,
        email: true,
        discord_username: true,
        discord_email: true,
        profile_image_url: true,
        profile_banner_url: true,
        reputation_count: true,

        created_at: true,
        description: true,
        detail: true,
        location: true,
        url: true,
        verified: true,
        followers: true,
        following: true,
        transactions: true,
        reputations: true,

        _count: {
          select: {
            followers: true,
            following: true,
            transactions: true,
          },
        },
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const {
    user_id,
    name,
    description,
    location,
    url,
    profile_banner_url,
    profile_image_url,
  } = (await request.json()) as {
    user_id: string;
    name: string;
    description: string;
    location: string;
    url: string;
    profile_banner_url: string;
    profile_image_url: string;
  };

  const userSchema = z
    .object({
      user_id: z.string().cuid(),
      name: z.string().min(1).max(50),
      description: z.string().max(160),
      location: z.string().max(30),
      url: z.string(),
      profile_banner_url: z.string(),
      profile_image_url: z.string(),
    })
    .strict();

  const zod = userSchema.safeParse({
    user_id,
    name,
    description,
    location,
    url,
    profile_banner_url,
    profile_image_url,
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
        name,
        description,
        location,
        url,
        profile_banner_url,
        profile_image_url,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { user_id, detail } = (await request.json()) as {
    user_id: string;
    detail: string;
  };

  const userSchema = z
    .object({
      user_id: z.string().cuid(),
      detail: z.string(),
    })
    .strict();

  const zod = userSchema.safeParse({
    user_id,
    detail,
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
        detail,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
