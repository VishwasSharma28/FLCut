import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // if visitor already has a cookie, leave it alone
  if (request.cookies.get("visitorId")) {
    return response;
  }

  // primary: assign a new random visitor ID
  const newVisitorId = nanoid(16);

  response.cookies.set("visitorId", newVisitorId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
  });

  return response;
}

export const config = {
  // run on all routes except static files and Next.js internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};