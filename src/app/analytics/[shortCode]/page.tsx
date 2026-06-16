import { prisma } from "@/lib/prisma";
import LetterGlitch from "@/components/LetterGlitch";

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
      <main className="relative min-h-screen overflow-hidden bg-black text-white">
        <div className="fixed inset-0 z-0">
          <LetterGlitch glitchColors={["#0f172a","#1e293b","#334155"]} glitchSpeed={80} centerVignette outerVignette smooth />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <h1 className="text-3xl font-bold">Link not found</h1>
        </div>
      </main>
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
      <div className="relative z-10 p-8">

      <h1 className="text-4xl font-bold mb-8">Analytics</h1>

      <div className="max-w-4xl mx-auto space-y-4">

        {/* Short Code */}
        <div className="border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 mb-2">Short Code</p>
          <p>{link.shortCode}</p>
        </div>

        {/* Original URL */}
        <div className="border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 mb-2">Original URL</p>
          <p className="break-all">{link.originalUrl}</p>
        </div>

        {/* Launch Time */}
        <div className="border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 mb-2">Launch Time</p>
          <p>{link.launchAt ? new Date(link.launchAt).toLocaleString() : "Immediate"}</p>
        </div>

        {/* Expiry Time */}
        <div className="border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 mb-2">Expiry Time</p>
          <p>{link.expiresAt ? new Date(link.expiresAt).toLocaleString() : "Never"}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">

          <div className="border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 mb-2">Total Clicks</p>
            <p className="text-3xl font-bold">{link.clicks}</p>
          </div>

          <div className="border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 mb-2">Unique Visitors</p>
            <p className="text-3xl font-bold">{uniqueVisitors}</p>
          </div>

          <div className="border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 mb-2">Click Records</p>
            <p className="text-3xl font-bold">{link.clickRecords.length}</p>
          </div>

        </div>

        {/* Traffic Sources */}
        <div className="border border-gray-700 rounded-xl p-4">

          <p className="text-gray-400 mb-4">Traffic Sources</p>

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

        {/* Recent Clicks table */}
        <div className="border border-gray-700 rounded-xl p-4">

          <p className="text-gray-400 mb-4">Recent Clicks</p>

          {link.clickRecords.length === 0 ? (
            <p className="text-gray-500 text-sm">No clicks yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-left border-b border-gray-700">
                    <th className="pb-2 pr-4">Time</th>
                    <th className="pb-2 pr-4">Visitor ID</th>
                    <th className="pb-2 pr-4">Device</th>
                    <th className="pb-2 pr-4">Source</th>
                    <th className="pb-2">Referrer</th>
                  </tr>
                </thead>
                <tbody>
                  {link.clickRecords.map((click) => (
                    <tr
                      key={click.id}
                      className="border-b border-gray-800 hover:bg-gray-900"
                    >
                      <td className="py-2 pr-4 text-gray-300 whitespace-nowrap">
                        {new Date(click.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 pr-4 font-mono text-gray-300">
                        {click.visitorId
                          ? click.visitorId.slice(0, 8) + "…"
                          : "—"}
                      </td>
                      <td className="py-2 pr-4 text-gray-300">
                        {click.device ?? "—"}
                      </td>
                      <td className="py-2 pr-4 text-gray-300">
                        {click.source ?? "—"}
                      </td>
                      <td className="py-2 text-gray-300 break-all">
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
  );
}