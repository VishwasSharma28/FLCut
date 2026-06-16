import { NextResponse } from "next/server";

// Next.js 16+ uses proxy.ts at the project root, not this file.
// This file is not active. Kept to avoid confusion.
export function middleware() {
  return NextResponse.next();
}