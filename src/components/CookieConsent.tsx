"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // only show if no previous choice has been made
    const stored = localStorage.getItem("cookieConsent");
    if (!stored) setVisible(true);
  }, []);

  const handleConsent = (choice: "accepted" | "declined") => {
    // set a cookie so proxy.ts can read consent on the next request
    const maxAge = 60 * 60 * 24 * 365; // 1 year in seconds
    document.cookie = `cookieConsent=${choice}; max-age=${maxAge}; path=/; SameSite=Lax`;

    // store in localStorage so the banner never reappears
    localStorage.setItem("cookieConsent", choice);

    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-xl mx-auto rounded-2xl border border-white/10 bg-black/85 backdrop-blur-md p-5">

        <p className="text-sm text-gray-300 mb-1 font-medium">
          Cookie Notice
        </p>

        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          We use cookies only for analytics and unique visitor counting.
          No personal data is collected or shared.
        </p>

        <div className="flex gap-3">

          <button
            onClick={() => handleConsent("accepted")}
            className="px-5 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Accept
          </button>

          <button
            onClick={() => handleConsent("declined")}
            className="px-5 py-2 rounded-xl border border-white/20 text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
          >
            Decline
          </button>

        </div>

      </div>
    </div>
  );
}
