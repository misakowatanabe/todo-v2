import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userLoggedIn = request.cookies.get('user_logged_in')?.value

  if (
    userLoggedIn &&
    !request.nextUrl.pathname.startsWith('/all') &&
    !request.nextUrl.pathname.startsWith('/settings') &&
    !request.nextUrl.pathname.startsWith('/label/:path')
  ) {
    return NextResponse.redirect(new URL('/all', request.url))
  }

  if (
    !userLoggedIn &&
    !request.nextUrl.pathname.startsWith('/signin') &&
    !request.nextUrl.pathname.startsWith('/signup') &&
    !request.nextUrl.pathname.startsWith('/label/:path')
  ) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/all', '/label/:path', '/settings', '/signin', '/signup'],
}
