"use client";

import { useState } from "react";
import Link from "next/link";
import LetterGlitch from "@/components/LetterGlitch";

export default function Home() {

  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState("");
  const [launchAt, setLaunchAt] = useState("");

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
          launchAt,
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

  const handleClear = () => {

    setUrl("");
    setCustomAlias("");
    setLaunchAt("");
    setExpiresAt("");
    setShortUrl("");
    setError("");

  };

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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">

      {/* Hero Section */}
      <div className="text-center mb-10 max-w-xl">



        <h1 className="text-5xl font-bold mb-4 leading-tight">
          FLCUT
        </h1>

        <p className="text-gray-400 text-base leading-relaxed">
          Shorten Links.<br />Track Performance.
        </p>

      </div>

      {/* Generator Section — glassmorphism card */}
      <div className="w-full max-w-xl p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">

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

        {/* Launch Time Input */}
        <input
          type="datetime-local"
          step={60}
          value={launchAt}
          onChange={(e) => setLaunchAt(e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
          className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 outline-none mt-4 text-gray-400 [color-scheme:dark]"
        />

        {/* Expiry Input */}
        <input
          type="datetime-local"
          step={60}
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
          className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 outline-none mt-4 text-gray-400 [color-scheme:dark]"
        />

        {/* Shorten Button */}
        <button
          onClick={handleShorten}
          disabled={loading}
          className="w-full p-3 rounded-lg bg-white text-black font-semibold mt-4 hover:bg-gray-200 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>

        {/* Clear Button */}
        <button
          onClick={handleClear}
          type="button"
          className="w-full p-3 rounded-lg border border-gray-700 mt-3 hover:bg-gray-900 hover:cursor-pointer"
        >
          Clear Form
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

      </div>

    </main>
  );
}