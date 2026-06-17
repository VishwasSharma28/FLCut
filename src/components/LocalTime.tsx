"use client";

/**
 * Renders a UTC date value in the user's local timezone.
 * Must be a client component — toLocaleString() on the server always
 * uses the server timezone (UTC on Vercel), not the user's timezone.
 */
export default function LocalTime({
  value,
  fallback = "—",
}: {
  value: Date | string | null | undefined;
  fallback?: string;
}) {
  if (!value) return <span>{fallback}</span>;
  return <span>{new Date(value).toLocaleString()}</span>;
}
