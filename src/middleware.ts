import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    // Get session
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Auth error in middleware:', error);
    }

    // Handle API routes that require authentication
    if (req.nextUrl.pathname.startsWith('/api/')) {
      if (!session) {
        return new NextResponse(
          JSON.stringify({ error: 'Authentication required' }),
          { 
            status: 401, 
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credentials': 'true',
              'Access-Control-Allow-Origin': req.headers.get('origin') || '*'
            } 
          }
        );
      }
      return res;
    }

    return handleRedirect(req, !!session);
  } catch (error) {
    console.error('Middleware error:', error);
    return res;
  }
}

function handleRedirect(req: NextRequest, isAuthenticated: boolean) {
  const url = req.nextUrl.clone();
  const isAuthPage = url.pathname.startsWith('/auth');
  const isProtectedRoute = url.pathname.startsWith('/dashboard') || 
                          url.pathname.startsWith('/results');
  const isLandingPage = url.pathname === '/';

  // If user is not signed in and trying to access protected routes
  if (!isAuthenticated && isProtectedRoute) {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Only redirect from auth pages or landing page if user is signed in
  if (isAuthenticated && (isAuthPage || isLandingPage)) {
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
