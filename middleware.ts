import { NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r));
  const isPrivateRoute = privateRoutes.some((r) => pathname.startsWith(r));

  if (!accessToken) {
    if (refreshToken) {
      const resp = await fetch(new URL("/api/auth/session", request.url), {
        headers: { cookie: request.headers.get("cookie") ?? "" },
        cache: "no-store",
      });

      const setCookieHeader = resp.headers.get("set-cookie");

      if (setCookieHeader) {
        const res = isPublicRoute
          ? NextResponse.redirect(new URL("/", request.url))
          : NextResponse.next();
        res.headers.set("set-cookie", setCookieHeader);
        return res;
      }
    }

    if (isPublicRoute) return NextResponse.next();
    if (isPrivateRoute)
      return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublicRoute) return NextResponse.redirect(new URL("/", request.url));
  if (isPrivateRoute) return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
