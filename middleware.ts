import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { REDIRECTED } from 'utils/constants'

export async function middleware(request: NextRequest) {
  const userLoggedIn = request.cookies.get('user_logged_in')?.value

  if (
    userLoggedIn &&
    !request.nextUrl.pathname.startsWith('/all') &&
    !request.nextUrl.pathname.startsWith('/settings') &&
    !request.nextUrl.pathname.startsWith('/label')
  ) {
    return NextResponse.redirect(new URL('/all', request.url))
  }

  if (
    !userLoggedIn &&
    !request.nextUrl.pathname.startsWith('/signin') &&
    !request.nextUrl.pathname.startsWith('/signup')
  ) {
    const response = NextResponse.redirect(new URL('/signin', request.url))
    response.cookies.set(REDIRECTED, 'true')

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/all', '/settings', '/signin', '/signup', '/label/:path*'],
}
