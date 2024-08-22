import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userLoggedIn = request.cookies.get('user_logged_in')?.value

  if (
    userLoggedIn &&
    !request.nextUrl.pathname.startsWith('/dashboard') &&
    !request.nextUrl.pathname.startsWith('/account') &&
    !request.nextUrl.pathname.startsWith('/label/:path')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
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
  matcher: ['/dashboard', '/label/:path', '/account', '/signin', '/signup'],
}
