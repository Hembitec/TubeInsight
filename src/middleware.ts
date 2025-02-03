import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Cache auth state for 1 second to prevent multiple checks
const authStateCache = new Map<string, { state: boolean; timestamp: number }>();
const CACHE_TTL = 1000; // 1 second

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  try {
    // Get the Firebase ID token from the request
    const token = req.cookies.get('firebase-token')?.value;

    if (!token) {
      return handleRedirect(req, false);
    }

    // Check cache first
    const cacheKey = token;
    const cachedAuth = authStateCache.get(cacheKey);
    const now = Date.now();

    if (cachedAuth && now - cachedAuth.timestamp < CACHE_TTL) {
      return handleRedirect(req, cachedAuth.state);
    }

    // Verify the token
    try {
      // Note: In production, you should use Firebase Admin SDK to verify tokens
      // This is a temporary solution for development
      const isValid = Boolean(token && token.length > 0);
      authStateCache.set(cacheKey, { state: isValid, timestamp: now });
      return handleRedirect(req, isValid);
    } catch (error) {
      console.error('Error verifying token:', error);
      return handleRedirect(req, false);
    }
  } catch (error) {
    console.error('Middleware error:', error);
    return handleRedirect(req, false);
  }
}

function handleRedirect(req: NextRequest, isAuthenticated: boolean): NextResponse {
  const url = req.nextUrl.clone();
  const isAuthPage = url.pathname.startsWith('/auth');
  const isLandingPage = url.pathname === '/';

  if (!isAuthenticated && !isAuthPage) {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && (isAuthPage || isLandingPage)) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};