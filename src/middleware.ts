import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'lush_admin_token';
const PROTECTED_ADMIN_PREFIXES = ['/admin'];
const PUBLIC_ADMIN_ROUTES = ['/admin/login'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  // 1. Check if route is an admin route
  const isAdminRoute = PROTECTED_ADMIN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isPublicAdminRoute = PUBLIC_ADMIN_ROUTES.includes(pathname);

  // If user is accessing protected admin route without valid token, redirect to login
  if (isAdminRoute && !isPublicAdminRoute) {
    if (!token) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is visiting /admin/login while already logged in, redirect to dashboard /admin
  if (isPublicAdminRoute && token) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // 2. Attach Security Headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
