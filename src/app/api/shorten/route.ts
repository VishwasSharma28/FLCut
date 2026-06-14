import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { url } = body;

    const shortCode = nanoid(6);

    const newLink = await prisma.link.create({
      data: {
        originalUrl: url,
        shortCode: shortCode,
      },
    });

    return NextResponse.json({
      shortUrl: `http://localhost:3000/${newLink.shortCode}`,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}