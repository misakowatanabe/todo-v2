import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('currentUser')?.value

  if (
    currentUser &&
    !request.nextUrl.pathname.startsWith('/dashboard') &&
    !request.nextUrl.pathname.startsWith('/account')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (
    !currentUser &&
    !request.nextUrl.pathname.startsWith('/signin') &&
    !request.nextUrl.pathname.startsWith('/signup')
  ) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard', '/account', '/signin', '/signup'],
}

// export const config = {
//   matcher: '/dashboard',
// }

// export const config = {
//   // Skip all paths that should not be internationalized. This example skips the
//   // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
//   matcher: ['/((?!api|_next|.*\\..*).*)'],
// }
