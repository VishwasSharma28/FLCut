"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
  setLoading(true);
    try {
    new URL(url);

    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    setShortUrl(data.shortUrl);

  } catch {
    alert("Please enter a valid full URL.");
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
  className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 outline-none mb-4"
/>

        <button
          onClick={handleShorten}
          disabled={loading}
          className="w-full bg-white text-black p-3 rounded-lg font-semibold cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Shortening..." : "Shorten URL"}
          
        </button>
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
        <p>Please include https:// in your URL.</p>
        <p className="mt-2">
          Example: https://google.com
        </p>
      </div>

    </main>
  );
}