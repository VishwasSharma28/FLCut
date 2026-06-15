import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

const reservedAliases = [
  "api",
  "dashboard",
  "admin",
  "login",
  "signup",
  "settings",
];

export async function POST(request: Request) {

  try {

    const body = await request.json();

    const { url, customAlias, expiresAt } = body;

    // if custom alias exists, use it
    // otherwise generate random nanoid
    const shortCode = customAlias || nanoid(6);

    // reserved alias check
    if (reservedAliases.includes(shortCode.toLowerCase())) {

      return NextResponse.json(
        {
          error: "This alias is reserved",
        },
        {
          status: 400,
        }
      );

    }

    // collision check
    const existingAlias = await prisma.link.findUnique({
      where: {
        shortCode,
      },
    });

    // if alias already exists
    if (existingAlias) {

      return NextResponse.json(
        {
          error: "Alias already taken",
        },
        {
          status: 400,
        }
      );

    }

    const newLink = await prisma.link.create({
      data: {
  originalUrl: url,
  shortCode,
  expiresAt: expiresAt
  ? new Date(expiresAt)
  : null,
},
    });

    return NextResponse.json({
      shortUrl: `http://localhost:3000/${newLink.shortCode}`,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );

  }

}
