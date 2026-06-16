"use client";

import { useEffect, useState } from "react";
import LetterGlitch from "@/components/LetterGlitch";

type Link = {
  originalUrl: string;
  shortUrl: string;
};

export default function DashboardPage() {

  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {

    const storedLinks = JSON.parse(
      localStorage.getItem("links") || "[]"
    );

    setLinks(storedLinks);

  }, []);

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

      <h1 className="text-4xl font-bold mb-8 text-center">
        Your Dashboard
      </h1>

      <div className="max-w-4xl mx-auto space-y-4">

        {links.length === 0 ? (

          <p className="text-center text-gray-400">
            No links generated yet.
          </p>

        ) : (

          links.map((link, index) => (

            <div
              key={index}
              className="border border-gray-700 rounded-xl p-4"
            >

              <p className="text-gray-400 mb-2">
                Original URL:
              </p>

              <p className="break-all mb-4">
                {link.originalUrl}
              </p>

              <p className="text-gray-400 mb-2">
                Short URL:
              </p>

              <a
                href={link.shortUrl}
                target="_blank"
                className="text-blue-400 underline break-all"
              >
                {link.shortUrl}
              </a>
              <div className="mt-4 flex gap-4">

  <a
    href={link.shortUrl}
    target="_blank"
    className="px-3 py-2 border border-gray-700 rounded-lg hover:bg-gray-900"
  >
    Open Link
  </a>

  <a
    href={`/analytics/${link.shortUrl.split("/").pop()}`}
    className="px-3 py-2 border border-gray-700 rounded-lg hover:bg-gray-900"
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
  );
}