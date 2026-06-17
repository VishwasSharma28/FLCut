"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LetterGlitch from "@/components/LetterGlitch";
import PageFooter from "@/components/PageFooter";

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
          // convert browser local time → UTC ISO string so Vercel stores the correct time
          launchAt: launchAt ? new Date(launchAt).toISOString() : undefined,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">

        {/* Logo */}
        <div id="logo-placeholder" className="mb-6">
          <Image
            src="/logo.png"
            alt="FLCut logo"
            width={80}
            height={80}
            className="mx-auto sm:w-24 sm:h-24"
            priority
          />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8 max-w-xl">

          <h1 className="text-4xl sm:text-5xl font-bold mb-3 leading-tight">
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
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 outline-none placeholder-gray-500 focus:border-white/30 transition-colors"
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
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 outline-none mt-3 placeholder-gray-500 focus:border-white/30 transition-colors"
          />

          {/* Launch Time Input */}
          <div className="mt-3">
            <label className="block text-xs text-gray-400 mb-1 ml-1">Launch Time (Optional)</label>
            <input
              type="datetime-local"
              step={60}
              value={launchAt}
              onChange={(e) => setLaunchAt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10 outline-none text-gray-400 [color-scheme:dark] focus:border-white/30 transition-colors"
            />
          </div>

          {/* Expiry Input */}
          <div className="mt-3">
            <label className="block text-xs text-gray-400 mb-1 ml-1">Expiry Time (Optional)</label>
            <input
              type="datetime-local"
              step={60}
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10 outline-none text-gray-400 [color-scheme:dark] focus:border-white/30 transition-colors"
            />
          </div>

          {/* Primary: Shorten URL */}
          <button
            onClick={handleShorten}
            disabled={loading}
            className="w-full p-3 rounded-xl bg-white text-black font-semibold mt-4 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span>Shortening</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-black inline-block animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-black inline-block animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-black inline-block animate-bounce [animation-delay:300ms]" />
                </span>
              </span>
            ) : "Shorten URL"}
          </button>

          {/* Secondary: Clear Form */}
          <button
            onClick={handleClear}
            type="button"
            className="w-full p-3 rounded-xl border border-white/20 font-medium mt-3 hover:bg-white/10 transition-colors cursor-pointer"
          >
            Clear Form
          </button>

          {/* Error Message */}
          {
            error && (
              <p className="text-red-400 mt-4 text-center text-sm">
                {error}
              </p>
            )
          }

          {/* Short URL Output */}
          {
            shortUrl && (
              <div className="mt-4 text-center">

                <p className="text-gray-400 mb-2 text-sm">
                  Shortened URL:
                </p>

                <a
                  href={shortUrl}
                  target="_blank"
                  className="text-blue-400 underline break-all"
                >
                  {shortUrl}
                </a>

              </div>
            )
          }

        </div>

        {/* Tertiary: View Dashboard */}
        <div className="w-full max-w-xl mt-3">
          <Link href="/dashboard">
            <div className="w-full p-3 rounded-xl border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-center">
              View Dashboard
            </div>
          </Link>
        </div>

        {/* Instructions */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Include https:// — e.g. https://google.com
        </p>

      </div>

    </main>

    {/* Copyright — solid black band, no effects */}
    <PageFooter />

    </>
  );
}