import { NextResponse } from 'next/server';
<<<<<<< HEAD
import { verifyToken } from '@/lib/auth';
=======
import { verifyToken } from './lib/auth';
>>>>>>> 36a897d4c084dd9b8fa6f8b63d371a9133886098

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/home', '/signin', '/signup', '/'];

<<<<<<< HEAD
export async function middleware(request) {
=======
export function middleware(request) {
>>>>>>> 36a897d4c084dd9b8fa6f8b63d371a9133886098
  const { pathname } = request.nextUrl;

  // Allow public routes and API auth routes
  const isPublic =
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon');

  if (isPublic) return NextResponse.next();

  // Check auth token
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

<<<<<<< HEAD
  const decoded = await verifyToken(token);
=======
  const decoded = verifyToken(token);
>>>>>>> 36a897d4c084dd9b8fa6f8b63d371a9133886098
  if (!decoded) {
    const response = NextResponse.redirect(new URL('/signin', request.url));
    response.cookies.delete('auth_token');
    return response;
  }

  // Inject user id into headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', decoded.id);
  requestHeaders.set('x-user-email', decoded.email);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};