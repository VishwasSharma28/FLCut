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

// ─── Confirmation Dialog ──────────────────────────────────────────────────────
function ConfirmDialog({
  onCancel,
  onConfirm,
  loading,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl">
        <h2 className="text-lg font-bold mb-2">Delete this link?</h2>
        <p className="text-gray-400 text-sm mb-6">
          This action cannot be undone. The link and all its analytics will be
          permanently removed from the database.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-white/20 text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Which card is pending DB deletion (by shortUrl), null = none
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const storedLinks = JSON.parse(localStorage.getItem("links") || "[]");
    setLinks(storedLinks);
    setIsLoading(false);
  }, []);

  // ── Feature 2: remove card from localStorage only ─────────────────────────
  function removeFromLocal(shortUrl: string) {
    const updated = links.filter((l) => l.shortUrl !== shortUrl);
    setLinks(updated);
    localStorage.setItem("links", JSON.stringify(updated));
  }

  // ── Feature 1: permanently delete from database ───────────────────────────
  async function confirmDelete() {
    if (!pendingDelete) return;

    const shortCode = pendingDelete.split("/").pop()!;
    setDeleting(true);

    try {
      const res = await fetch(`/api/links/${shortCode}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Deletion failed. Please try again.");
        return;
      }

      // Remove from local state and localStorage so dashboard updates instantly
      const updated = links.filter((l) => l.shortUrl !== pendingDelete);
      setLinks(updated);
      localStorage.setItem("links", JSON.stringify(updated));
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  }

  return (
    <>
      {/* ── Confirmation dialog (only rendered when a delete is pending) ── */}
      {pendingDelete && (
        <ConfirmDialog
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
          loading={deleting}
        />
      )}

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
                  className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 sm:p-5"
                >

                  {/* ── Feature 2: X — remove from localStorage (top-left) ── */}
                  <button
                    onClick={() => removeFromLocal(link.shortUrl)}
                    title="Remove from local list"
                    aria-label="Remove from local list"
                    className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:text-white hover:bg-white/10 transition-colors text-xs font-bold"
                  >
                    ✕
                  </button>

                  {/* ── Feature 1: Trash — delete from database (top-right) ── */}
                  <button
                    onClick={() => setPendingDelete(link.shortUrl)}
                    title="Delete link permanently"
                    aria-label="Delete link permanently"
                    className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    {/* Inline SVG trash icon — no extra dependency */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>

                  {/* Card content — pt-4 so it clears both icon buttons */}
                  <div className="pt-4">

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