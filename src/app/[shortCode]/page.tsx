import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { nanoid } from "nanoid";
import LetterGlitch from "@/components/LetterGlitch";

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

// identify which app or browser sent the request
function parseSource(ua: string): string {
  if (/Instagram/i.test(ua)) return "Instagram";
  if (/LinkedIn/i.test(ua)) return "LinkedIn";
  if (/WhatsApp/i.test(ua)) return "WhatsApp";
  if (/FBAN|FBAV/i.test(ua)) return "Facebook";
  if (/Telegram/i.test(ua)) return "Telegram";
  if (/Edg\//i.test(ua)) return "Edge";
  if (/Chrome/i.test(ua)) return "Chrome";
  if (/Safari/i.test(ua)) return "Safari";
  return "Unknown";
}

export default async function RedirectPage({ params }: PageProps) {
  const { shortCode } = await params;

  const link = await prisma.link.findUnique({
    where: { shortCode },
  });

  if (!link) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-black text-white">
        <div className="fixed inset-0 z-0">
          <LetterGlitch glitchColors={["#0f172a","#1e293b","#334155"]} glitchSpeed={80} centerVignette outerVignette smooth />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <h1 className="text-3xl font-bold">Link not found</h1>
        </div>
      </div>
    );
  }

  if (link.launchAt && new Date() < new Date(link.launchAt)) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-black text-white">
        <div className="fixed inset-0 z-0">
          <LetterGlitch glitchColors={["#0f172a","#1e293b","#334155"]} glitchSpeed={80} centerVignette outerVignette smooth />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <h1 className="text-3xl font-bold">This link is not live yet.</h1>
        </div>
      </div>
    );
  }

  if (link.expiresAt && new Date() > new Date(link.expiresAt)) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-black text-white">
        <div className="fixed inset-0 z-0">
          <LetterGlitch glitchColors={["#0f172a","#1e293b","#334155"]} glitchSpeed={80} centerVignette outerVignette smooth />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <h1 className="text-3xl font-bold">This link has expired.</h1>
        </div>
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
  const source = parseSource(userAgent);

  await prisma.click.create({
    data: {
      linkId: link.id,
      visitorId,
      referrer,
      device,
      source,
    },
  });

  await prisma.link.update({
    where: { id: link.id },
    data: { clicks: { increment: 1 } },
  });

  redirect(link.originalUrl);
}