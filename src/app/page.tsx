"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");

  const handleShorten = () => {
    try {
      new URL(url);

      alert("Valid URL ✅");
    } catch {
      alert("Please enter a valid full URL.");
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
          className="w-full bg-white text-black p-3 rounded-lg font-semibold"
        >
          Shorten URL
        </button>
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