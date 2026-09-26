import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const AUTH_COOKIE_NAME = 'auth_token';

const PUBLIC_AUTH_ROUTES = ['/sign-in', '/sign-up'];
const PUBLIC_SYSTEM_ROUTES = ['/favicon.ico', '/robots.txt'];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const isAuthRoute = PUBLIC_AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isSystemRoute = PUBLIC_SYSTEM_ROUTES.some((route) => pathname.startsWith(route));

  if (isSystemRoute) {
    return NextResponse.next();
  }

  if (!token && !isAuthRoute) {
    const signInUrl = new URL('/sign-in', request.url);
    if (pathname !== '/') {
      signInUrl.searchParams.set('callbackUrl', `${pathname}${search}`);
    }
    return NextResponse.redirect(signInUrl);
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
