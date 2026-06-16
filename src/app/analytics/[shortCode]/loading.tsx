import LetterGlitch from "@/components/LetterGlitch";

// shown automatically by Next.js while the analytics server component fetches data
export default function AnalyticsLoading() {

  const skeletonCard = "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 animate-pulse";

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      <div className="fixed inset-0 z-0">
        <LetterGlitch
          glitchColors={["#0f172a", "#1e293b", "#334155"]}
          glitchSpeed={80}
          centerVignette
          outerVignette
          smooth
        />
      </div>

      <div className="relative z-10 p-4 sm:p-8">

        {/* Back button skeleton */}
        <div className="h-9 w-24 rounded-xl border border-white/10 bg-white/5 animate-pulse mb-6" />

        {/* Logo skeleton */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-white/5 animate-pulse" />
        </div>

        {/* Heading skeleton */}
        <div className="h-10 bg-white/5 rounded-xl animate-pulse max-w-[180px] mx-auto mb-8" />

        <div className="max-w-4xl mx-auto space-y-4">

          {/* Info card skeletons */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={skeletonCard}>
              <div className="h-2.5 bg-white/10 rounded w-20 mb-3" />
              <div className="h-4 bg-white/10 rounded w-3/4" />
            </div>
          ))}

          {/* Stats row skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={skeletonCard}>
                <div className="h-2.5 bg-white/10 rounded w-24 mb-3" />
                <div className="h-9 bg-white/10 rounded w-12" />
              </div>
            ))}
          </div>

          {/* Table skeleton */}
          <div className={skeletonCard}>
            <div className="h-2.5 bg-white/10 rounded w-28 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-white/10 rounded w-full" />
              ))}
            </div>
          </div>

        </div>

      </div>

    </main>
  );
}
