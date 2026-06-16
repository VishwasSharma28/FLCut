"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LetterGlitch from "@/components/LetterGlitch";
import BackButton from "@/components/BackButton";
import PageFooter from "@/components/PageFooter";

type LinkItem = {
  originalUrl: string;
  shortUrl: string;
};

export default function DashboardPage() {

  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedLinks = JSON.parse(
      localStorage.getItem("links") || "[]"
    );
    setLinks(storedLinks);
    setIsLoading(false);
  }, []);

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

          <BackButton href="/" label="Home" />

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

          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
            Your Dashboard
          </h1>

          <div className="max-w-4xl mx-auto space-y-4">

            {isLoading ? (

              // skeleton cards while localStorage is read
              [1, 2].map((i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 animate-pulse">
                  <div className="h-2.5 bg-white/10 rounded w-24 mb-3" />
                  <div className="h-4 bg-white/10 rounded w-full mb-5" />
                  <div className="h-2.5 bg-white/10 rounded w-16 mb-2" />
                  <div className="h-4 bg-white/10 rounded w-48 mb-4" />
                  <div className="flex gap-3">
                    <div className="h-9 bg-white/10 rounded-xl w-24" />
                    <div className="h-9 bg-white/10 rounded-xl w-32" />
                  </div>
                </div>
              ))

            ) : links.length === 0 ? (

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center">
                <p className="text-gray-400">No links generated yet.</p>
              </div>

            ) : (

              links.map((link, index) => (

                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 sm:p-5"
                >

                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                    Original URL
                  </p>

                  <p className="break-all mb-4 text-sm">
                    {link.originalUrl}
                  </p>

                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                    Short URL
                  </p>

                  <a
                    href={link.shortUrl}
                    target="_blank"
                    className="text-blue-400 underline break-all text-sm"
                  >
                    {link.shortUrl}
                  </a>

                  {/* flex-wrap so buttons stack on very small screens */}
                  <div className="mt-4 flex flex-wrap gap-3">

                    <a
                      href={link.shortUrl}
                      target="_blank"
                      className="px-4 py-2 rounded-xl border border-white/20 text-sm font-medium hover:bg-white/10 transition-colors"
                    >
                      Open Link
                    </a>

                    <a
                      href={`/analytics/${link.shortUrl.split("/").pop()}`}
                      className="px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors"
                    >
                      View Analytics
                    </a>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </main>

      <PageFooter />
    </>
  );
}