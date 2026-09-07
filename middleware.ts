import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  if (url.pathname !== '/maintenance' && !url.pathname.startsWith('/admin') && !url.pathname.startsWith('/_next')) {
    url.pathname = '/maintenance'
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon).*)'],
}
