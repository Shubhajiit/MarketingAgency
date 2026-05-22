import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js middleware for route protection.
 *
 * Since access tokens are stored in memory (not cookies), we can't verify
 * them server-side in middleware. Instead, we check for the refresh token
 * cookie as a signal that the user has an active session.
 *
 * The actual auth verification happens client-side in the layout components.
 * This middleware provides a fast redirect for clearly unauthenticated users.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for refresh token cookie (set by backend on login)
  const hasRefreshToken = request.cookies.has('refreshToken');

  // Protected routes
  const protectedPaths = ['/dashboard', '/bookings', '/videos'];
  const adminPaths = ['/admin'];

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isAdmin = adminPaths.some((path) => pathname.startsWith(path));

  // Redirect unauthenticated users to login
  if ((isProtected || isAdmin) && !hasRefreshToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  const authPaths = ['/login', '/register'];
  const isAuthPage = authPaths.some((path) => pathname === path);

  if (isAuthPage && hasRefreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/bookings/:path*',
    '/videos/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
