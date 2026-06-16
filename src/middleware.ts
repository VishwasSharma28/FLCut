import { NextResponse } from "next/server";

// Next.js only uses the middleware at the project root.
// This file is not active. Kept to avoid confusion.
export function middleware() {
  return NextResponse.next();
}