import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { nanoid } from "nanoid";

type PageProps = {
  params: Promise<{
    shortCode: string;
  }>;
};

// condense a raw user-agent string into a short readable label
function parseDevice(ua: string): string {
  if (/mobile|android|iphone|ipad/i.test(ua)) return "Mobile";
  if (/tablet/i.test(ua)) return "Tablet";
  if (/curl|wget|python|axios|node/i.test(ua)) return "Bot/Script";
  return "Desktop";
}

export default async function RedirectPage({ params }: PageProps) {
  const { shortCode } = await params;

  const link = await prisma.link.findUnique({
    where: { shortCode },
  });

  if (!link) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Link not found</h1>
      </div>
    );
  }

  if (link.launchAt && new Date() < new Date(link.launchAt)) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">This link is not live yet.</h1>
      </div>
    );
  }

  if (link.expiresAt && new Date() > new Date(link.expiresAt)) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">This link has expired.</h1>
      </div>
    );
  }

  const cookieStore = await cookies();
  const headerStore = await headers();

  const userAgent = headerStore.get("user-agent") ?? "Unknown";
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";

  // cookie is the primary source; fall back to a fingerprint from IP + UA
  const visitorId =
    cookieStore.get("visitorId")?.value ??
    nanoid(16); // middleware should have set it, but this guards against edge cases

  const referrer = headerStore.get("referer") ?? "Direct";
  const device = parseDevice(userAgent);

  await prisma.click.create({
    data: {
      linkId: link.id,
      visitorId,
      referrer,
      device,
    },
  });

  await prisma.link.update({
    where: { id: link.id },
    data: { clicks: { increment: 1 } },
  });

  redirect(link.originalUrl);
}