"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {

  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState("");

  const handleShorten = async () => {

    setLoading(true);
    setError("");

    try {

      new URL(url);

      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
            url,
            customAlias,
            expiresAt,
        }),
      });

      const data = await response.json();

      // backend error
      if (data.error) {

        setError(data.error);
        setShortUrl("");

        return;
      }

      // success
      setShortUrl(data.shortUrl);

      const existingLinks = JSON.parse(
        localStorage.getItem("links") || "[]"
      );

      existingLinks.push({
        originalUrl: url,
        shortUrl: data.shortUrl,
      });

      localStorage.setItem(
        "links",
        JSON.stringify(existingLinks)
      );

    } catch {

      setError("Please enter a valid full URL.");
      setShortUrl("");

    } finally {

      setLoading(false);

    }
  };

  return (

    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">

      {/* Generator Section */}
      <div className="w-full max-w-xl p-6 border border-gray-700 rounded-xl">

        <h1 className="text-4xl font-bold mb-6 text-center">
          FLCut
        </h1>

        {/* URL Input */}
        <input
          type="text"
          placeholder="Enter your long URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleShorten();
            }
          }}
          className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 outline-none"
        />

        {/* Custom Alias Input */}
        <input
  type="text"
  placeholder="Custom alias (optional)"
  value={customAlias}
  onChange={(e) => setCustomAlias(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleShorten();
    }
  }}
  className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 outline-none mt-4"
/>
{/* Expiry Input */}
<input
  type="datetime-local"
  step="1"
  value={expiresAt}
  onChange={(e) => setExpiresAt(e.target.value)}
  className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 outline-none mt-4 text-gray-400 [color-scheme:dark]"
/>

        {/* Button */}
        <button
          onClick={handleShorten}
          disabled={loading}
          className="w-full p-3 rounded-lg bg-white text-black font-semibold mt-4 hover:bg-gray-200 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>

        {/* Error Message */}
        {
          error && (
            <p className="text-red-400 mt-4 text-center">
              {error}
            </p>
          )
        }

        {/* Short URL Output */}
        {
          shortUrl && (
            <div className="mt-4 text-center">

              <p className="text-gray-400 mb-2">
                Shortened URL:
              </p>

              <a
                href={shortUrl}
                target="_blank"
                className="text-blue-400 underline"
              >
                {shortUrl}
              </a>

            </div>
          )
        }

      </div>

      {/* Instructions Section */}
      <div className="mt-6 text-center text-sm text-gray-400 max-w-xl">

        <p>
          Please include https:// in your URL.
        </p>

        <p className="mt-2">
          Example: https://google.com
        </p>

      </div>

      {/* Dashboard Link */}
      <div className="mt-6 text-center">

        <Link
          href="/dashboard"
          className="text-blue-400 underline"
        >
          View Dashboard
        </Link>

      </div>

    </main>
  );
}