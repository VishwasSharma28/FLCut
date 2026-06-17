import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { nanoid } from "nanoid";
import LetterGlitch from "@/components/LetterGlitch";
import BackButton from "@/components/BackButton";
import PageFooter from "@/components/PageFooter";

// always re-render on every request — launchAt/expiresAt must use the real current time
export const dynamic = "force-dynamic";

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

/**
 * Returns true for automated preview/crawler requests that should NOT
 * be counted as real clicks.
 *
 * Matched agents (all are headless bots, not human in-app browsers):
 *   facebookexternalhit — Meta's OG preview scraper (FB / IG / Messenger)
 *   Facebot             — legacy Meta alias
 *   meta-externalagent  — newer Meta crawl agent
 *   Meta-WebIndexer     — Meta AI indexer
 *   WhatsApp/<version>  — WhatsApp link-preview fetcher
 *                         (real WA users have a full Mozilla/5.0 UA)
 *   Twitterbot          — Twitter/X card preview
 *   Slackbot            — Slack unfurl bot
 *   LinkedInBot         — LinkedIn preview
 *   TelegramBot         — Telegram preview
 *   Googlebot           — Google crawler
 *   bingbot             — Bing crawler
 *   DuckDuckBot         — DuckDuckGo crawler
 *   ia_archiver         — Internet Archive
 *   Applebot            — Apple Siri previews
 */
function isCrawler(ua: string): boolean {
  return /facebookexternalhit|Facebot|meta-externalagent|Meta-WebIndexer|WhatsApp\/\d|Twitterbot|Slackbot|LinkedInBot|TelegramBot|Googlebot|bingbot|DuckDuckBot|ia_archiver|Applebot/i.test(ua);
}

// shared card used by error screens
const errorCard = "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 sm:p-12 text-center w-full max-w-sm";

export default async function RedirectPage({ params }: PageProps) {
  const { shortCode } = await params;

  const link = await prisma.link.findUnique({
    where: { shortCode },
  });

  // TEMP_DEBUG — remove after verifying fix in production
  console.log("[FLCut Debug]", {
    shortCode,
    serverUTC: new Date().toISOString(),
    serverTZ: Intl.DateTimeFormat().resolvedOptions().timeZone,
    launchAt_stored: link?.launchAt?.toISOString() ?? null,
    expiresAt_stored: link?.expiresAt?.toISOString() ?? null,
    isBeforeLaunch: link?.launchAt ? new Date() < link.launchAt : false,
    isAfterExpiry: link?.expiresAt ? new Date() > link.expiresAt : false,
  });

  if (!link) {
    return (
      <>
        <main className="relative min-h-screen overflow-hidden bg-black text-white">
          <div className="fixed inset-0 z-0">
            <LetterGlitch glitchColors={["#0f172a","#1e293b","#334155"]} glitchSpeed={80} centerVignette outerVignette smooth />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 gap-6">
            <div className={errorCard}>
              <h1 className="text-2xl sm:text-3xl font-bold">Link not found</h1>
              <p className="text-gray-400 text-sm mt-2">This short link does not exist.</p>
            </div>
            <BackButton href="/" label="Home" />
          </div>
        </main>
        <PageFooter />
      </>
    );
  }

  if (link.launchAt && new Date() < new Date(link.launchAt)) {
    return (
      <>
        <main className="relative min-h-screen overflow-hidden bg-black text-white">
          <div className="fixed inset-0 z-0">
            <LetterGlitch glitchColors={["#0f172a","#1e293b","#334155"]} glitchSpeed={80} centerVignette outerVignette smooth />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 gap-6">
            <div className={errorCard}>
              <h1 className="text-2xl sm:text-3xl font-bold">Not live yet</h1>
              <p className="text-gray-400 text-sm mt-2">This link hasn&apos;t launched. Check back later.</p>
            </div>
            <BackButton href="/" label="Home" />
          </div>
        </main>
        <PageFooter />
      </>
    );
  }

  if (link.expiresAt && new Date() > new Date(link.expiresAt)) {
    return (
      <>
        <main className="relative min-h-screen overflow-hidden bg-black text-white">
          <div className="fixed inset-0 z-0">
            <LetterGlitch glitchColors={["#0f172a","#1e293b","#334155"]} glitchSpeed={80} centerVignette outerVignette smooth />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 gap-6">
            <div className={errorCard}>
              <h1 className="text-2xl sm:text-3xl font-bold">Link expired</h1>
              <p className="text-gray-400 text-sm mt-2">This link is no longer active.</p>
            </div>
            <BackButton href="/" label="Home" />
          </div>
        </main>
        <PageFooter />
      </>
    );
  }

  const cookieStore = await cookies();
  const headerStore = await headers();

  const userAgent = headerStore.get("user-agent") ?? "Unknown";
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";

  // Skip click recording for automated preview/crawler requests.
  // These bots fetch the URL to generate a link preview and are NOT real visits.
  if (!isCrawler(userAgent)) {
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
  }

  redirect(link.originalUrl);
}