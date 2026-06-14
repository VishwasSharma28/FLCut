"use client";

import { useEffect, useState } from "react";

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
    <main className="min-h-screen bg-black text-white p-8">

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

            </div>

          ))

        )}

      </div>

    </main>
  );
}