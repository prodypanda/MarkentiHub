// pandamarket/frontend/src/middleware.ts
// =============================================================================
// PandaMarket — Hostname Detection Middleware
// Routes requests to Hub, Admin Panel, or Vendor Storefront based on hostname
// =============================================================================

import { NextResponse, type NextRequest } from 'next/server';

const HUB_DOMAIN = process.env.NEXT_PUBLIC_HUB_DOMAIN || 'pandamarket.local';

function applySecurityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('Content-Security-Policy', "default-src 'self'; img-src 'self' *.r2.cloudflarestorage.com");
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;

  // Remove port number for local development
  const cleanHostname = hostname.split(':')[0];

  // ─── Hub Central ───
  if (cleanHostname === HUB_DOMAIN || cleanHostname === `www.${HUB_DOMAIN}`) {
    const response = NextResponse.next();
    response.headers.set('x-pd-route-type', 'hub');
    return applySecurityHeaders(response);
  }

  // ─── Admin Panel ───
  if (cleanHostname === `admin.${HUB_DOMAIN}`) {
    const response = NextResponse.next();
    response.headers.set('x-pd-route-type', 'admin');
    return applySecurityHeaders(response);
  }

  // ─── API Passthrough ───
  if (cleanHostname === `api.${HUB_DOMAIN}`) {
    return applySecurityHeaders(NextResponse.next());
  }

  // ─── Vendor Storefront (subdomain or custom domain) ───

  // Resolve the store from the backend API
  try {
    const apiUrl = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000';
    const resolveRes = await fetch(
      `${apiUrl}/api/pd/stores/resolve?hostname=${encodeURIComponent(cleanHostname)}`,
      { next: { revalidate: 60 } }, // Cache for 60 seconds
    );

    if (resolveRes.ok) {
      const data = await resolveRes.json();

      // Rewrite to the internal storefront path while preserving the browser URL.
      // (store)/storefront/page.tsx handles the storefront homepage.
      const targetPathname = pathname === '/' ? '/storefront' : pathname;
      const rewriteUrl = new URL(targetPathname, request.url);
      const response = NextResponse.rewrite(rewriteUrl);
      response.headers.set('x-pd-route-type', 'store');
      response.headers.set('x-pd-store-id', data.store.id);
      response.headers.set('x-pd-store-subdomain', data.store.subdomain || '');
      response.headers.set('x-pd-store-theme', data.store.theme_id || 'minimal');
      response.headers.set('x-pd-store-name', data.store.name || '');
      return applySecurityHeaders(response);
    }
  } catch {
    // If API is unreachable, fall through to hub
  }

  // ─── Fallback to Hub ───
  const response = NextResponse.next();
  response.headers.set('x-pd-route-type', 'hub');
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    // Match all paths except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
