import { prisma } from "@/lib/prisma";
import Image from "next/image";
import LetterGlitch from "@/components/LetterGlitch";
import BackButton from "@/components/BackButton";
import PageFooter from "@/components/PageFooter";
import LocalTime from "@/components/LocalTime";

// shared style tokens
const card = "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4";
const label = "text-gray-400 text-xs uppercase tracking-wider mb-1";

type PageProps = {
  params: Promise<{
    shortCode: string;
  }>;
};

export default async function AnalyticsPage({ params }: PageProps) {
  const { shortCode } = await params;

  const link = await prisma.link.findUnique({
    where: { shortCode },
    include: {
      clickRecords: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!link) {
    return (
      <>
        <main className="relative min-h-screen overflow-hidden bg-black text-white">
          <div className="fixed inset-0 z-0">
            <LetterGlitch glitchColors={["#0f172a","#1e293b","#334155"]} glitchSpeed={80} centerVignette outerVignette smooth />
          </div>
          <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
            <div className={card + " text-center"}>
              <h1 className="text-2xl sm:text-3xl font-bold">Link not found</h1>
              <p className="text-gray-400 text-sm mt-2">This short link does not exist.</p>
              <div className="mt-4 flex justify-center">
                <BackButton href="/dashboard" label="Dashboard" />
              </div>
            </div>
          </div>
        </main>
        <PageFooter />
      </>
    );
  }

  const uniqueVisitors = new Set(
    link.clickRecords.map((c) => c.visitorId).filter(Boolean)
  ).size;

  // count clicks per source
  const sourceCounts: Record<string, number> = {};
  for (const click of link.clickRecords) {
    const s = click.source ?? "Unknown";
    sourceCounts[s] = (sourceCounts[s] ?? 0) + 1;
  }
  const sortedSources = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-black text-white">

        {/* Background */}
        <div className="fixed inset-0 z-0">
          <LetterGlitch
            glitchColors={["#0f172a", "#1e293b", "#334155"]}
            glitchSpeed={80}
            centerVignette
            outerVignette
            smooth
          />
        </div>

        {/* Content */}
        <div className="relative z-10 p-4 sm:p-8">

          <BackButton href="/dashboard" label="Dashboard" />

          {/* Logo */}
          <div id="logo-placeholder" className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="FLCut logo"
              width={64}
              height={64}
              priority
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Analytics</h1>

          <div className="max-w-4xl mx-auto space-y-4">

            {/* Short Code */}
            <div className={card}>
              <p className={label}>Short Code</p>
              <p>{link.shortCode}</p>
            </div>

            {/* Original URL */}
            <div className={card}>
              <p className={label}>Original URL</p>
              <p className="break-all">{link.originalUrl}</p>
            </div>

            {/* Launch Time */}
            <div className={card}>
              <p className={label}>Launch Time</p>
              <p><LocalTime value={link.launchAt} fallback="Immediate" /></p>
            </div>

            {/* Expiry Time */}
            <div className={card}>
              <p className={label}>Expiry Time</p>
              <p><LocalTime value={link.expiresAt} fallback="Never" /></p>
            </div>

            {/* Stats — stack on mobile, 3-col on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div className={card}>
                <p className={label}>Total Clicks</p>
                <p className="text-3xl font-bold">{link.clicks}</p>
              </div>

              <div className={card}>
                <p className={label}>Unique Visitors</p>
                <p className="text-3xl font-bold">{uniqueVisitors}</p>
              </div>

              <div className={card}>
                <p className={label}>Click Records</p>
                <p className="text-3xl font-bold">{link.clickRecords.length}</p>
              </div>

            </div>

            {/* Traffic Sources */}
            <div className={card}>

              <p className={label + " mb-4"}>Traffic Sources</p>

              {sortedSources.length === 0 ? (
                <p className="text-gray-500 text-sm">No data yet.</p>
              ) : (
                <ul className="space-y-2">
                  {sortedSources.map(([source, count]) => (
                    <li key={source} className="flex justify-between text-sm">
                      <span className="text-gray-300">{source}</span>
                      <span className="font-bold">{count}</span>
                    </li>
                  ))}
                </ul>
              )}

            </div>

            {/* Recent Clicks table — overflow-x-auto handles mobile */}
            <div className={card}>

              <p className={label + " mb-4"}>Recent Clicks</p>

              {link.clickRecords.length === 0 ? (
                <p className="text-gray-500 text-sm">No clicks yet.</p>
              ) : (
                <div className="overflow-x-auto -mx-1">
                  <table className="w-full text-sm min-w-[480px]">
                    <thead>
                      <tr className="text-gray-400 text-left border-b border-white/10">
                        <th className="pb-2 pr-4 font-medium">Time</th>
                        <th className="pb-2 pr-4 font-medium">Visitor ID</th>
                        <th className="pb-2 pr-4 font-medium">Device</th>
                        <th className="pb-2 pr-4 font-medium">Source</th>
                        <th className="pb-2 font-medium">Referrer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {link.clickRecords.map((click) => (
                        <tr
                          key={click.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-2 pr-4 text-gray-300 whitespace-nowrap">
                            <LocalTime value={click.createdAt} />
                          </td>
                          <td className="py-2 pr-4 font-mono text-gray-300 whitespace-nowrap">
                            {click.visitorId
                              ? click.visitorId.slice(0, 8) + "…"
                              : "—"}
                          </td>
                          <td className="py-2 pr-4 text-gray-300 whitespace-nowrap">
                            {click.device ?? "—"}
                          </td>
                          <td className="py-2 pr-4 text-gray-300 whitespace-nowrap">
                            {click.source ?? "—"}
                          </td>
                          <td className="py-2 text-gray-300 max-w-[160px] truncate">
                            {click.referrer ?? "Direct"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>

          </div>

        </div>

      </main>

      <PageFooter />
    </>
  );
}