import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Skip auth check for public routes and static assets
  if (
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname.startsWith("/api/auth") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.includes("favicon.ico")
  ) {
    return NextResponse.next()
  }

  // Check for auth token in cookies
  const token = request.cookies.get("auth-token")?.value

  // For API routes, return 401 if no token
  if (request.nextUrl.pathname.startsWith("/api") && !token) {
    return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 })
  }

  // For page routes, let client-side handle auth
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
