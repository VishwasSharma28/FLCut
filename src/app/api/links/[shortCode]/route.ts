import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ shortCode: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { shortCode } = await context.params;

    // Verify the link exists first
    const link = await prisma.link.findUnique({ where: { shortCode } });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Delete all Click records that belong to this link
    await prisma.click.deleteMany({ where: { linkId: link.id } });

    // Delete the Link itself
    await prisma.link.delete({ where: { id: link.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/links]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
