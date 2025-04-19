import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
const guestPaths = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);


  const pathname = request.nextUrl.pathname;

  if (!sessionCookie) {
    // Si c'est une page protégée (ex: /dashboard ou /invite)
    if (!guestPaths.includes(pathname)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname); // Ajout du callback
      return NextResponse.redirect(loginUrl);
    }

    // Sinon laisse accéder aux pages guest (login, register)
    return NextResponse.next();
  }


  if (guestPaths.includes(pathname) && sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard","/dashboard/:path*", "/login", "/invite/:path*"],
};
