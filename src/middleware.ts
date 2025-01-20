import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Cache auth state for 1 second to prevent multiple checks
const authStateCache = new Map<string, { state: boolean; timestamp: number }>();
const CACHE_TTL = 1000; // 1 second

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Check cache first
  const cacheKey = req.cookies.toString(); // Use cookies as cache key
  const cachedAuth = authStateCache.get(cacheKey);
  const now = Date.now();

  if (cachedAuth && now - cachedAuth.timestamp < CACHE_TTL) {
    return handleRedirect(req, cachedAuth.state);
  }

  // Get session and cache it
  const { data: { session } } = await supabase.auth.getSession();
  authStateCache.set(cacheKey, { state: !!session, timestamp: now });

  return handleRedirect(req, !!session);
}

function handleRedirect(req: NextRequest, isAuthenticated: boolean) {
  const url = req.nextUrl.clone();
  const isAuthPage = url.pathname.startsWith('/auth');
  const isProtectedRoute = url.pathname.startsWith('/dashboard') || 
                          url.pathname.startsWith('/results');

  // If user is not signed in and trying to access protected routes
  if (!isAuthenticated && isProtectedRoute) {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Only redirect from auth pages if user is signed in
  // This allows manual navigation to auth pages during sign out
  if (isAuthenticated && isAuthPage) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}