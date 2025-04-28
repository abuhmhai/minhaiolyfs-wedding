import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    
    // Skip middleware for public assets and API routes
    if (
      pathname.startsWith('/_next') || 
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/static') ||
      pathname.startsWith('/images') ||
      pathname === '/login' ||
      pathname === '/register' ||
      pathname === '/'
    ) {
      return NextResponse.next();
    }

    // Get the token and verify session
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    // Protected routes that require authentication
    const protectedRoutes = [
      '/account',
      '/cart',
      '/checkout',
      '/profile',
      '/information'
    ];

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !token) {
      // Store the original URL to redirect back after login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', encodeURIComponent(pathname));
      return NextResponse.redirect(loginUrl);
    }

    // Admin route protection
    if (pathname.startsWith('/admin')) {
      if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', encodeURIComponent(pathname));
        return NextResponse.redirect(loginUrl);
      }

      if (token.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, redirect to login to be safe
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}; 