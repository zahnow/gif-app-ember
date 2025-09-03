import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(request: NextRequest) {
  const session = getSessionCookie(request);
  if (!session) {
    const protectedPaths = ["/search", "/gif/"];
    if (
      protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
    ) {
      return NextResponse.redirect(
        new URL(
          `/login?redirect=${request.nextUrl.pathname}${request.nextUrl.searchParams ? `&${request.nextUrl.searchParams.toString()}` : ""}`,
          request.url,
        ),
      );
    }
  } else {
    const restrictedPaths = ["/login", "/register"];
    if (restrictedPaths.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/search", "/gif/:path*", "/login", "/register"],
};
