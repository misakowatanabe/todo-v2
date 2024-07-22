import { type NextRequest, NextResponse } from 'next/server'

// Config
const corsOptions: {
  allowedMethods: string[]
  allowedOrigins: string[]
  allowedHeaders: string[]
  exposedHeaders: string[]
  maxAge?: number
  credentials: boolean
} = {
  allowedMethods: (process.env?.ALLOWED_METHODS || '').split(','),
  allowedOrigins: (process.env?.ALLOWED_ORIGIN || '').split(','),
  allowedHeaders: (process.env?.ALLOWED_HEADERS || '').split(','),
  exposedHeaders: (process.env?.EXPOSED_HEADERS || '').split(','),
  maxAge: (process.env?.MAX_AGE && parseInt(process.env?.MAX_AGE)) || undefined, // 60 * 60 * 24 * 30, // 30 days
  credentials: process.env?.CREDENTIALS == 'true',
}

// Middleware
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Allowed origins check
  const origin = request.headers.get('origin') ?? ''
  if (corsOptions.allowedOrigins.includes('*') || corsOptions.allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  // Set default CORS headers
  response.headers.set('Access-Control-Allow-Credentials', corsOptions.credentials.toString())
  response.headers.set('Access-Control-Allow-Methods', corsOptions.allowedMethods.join(','))
  response.headers.set('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','))
  response.headers.set('Access-Control-Expose-Headers', corsOptions.exposedHeaders.join(','))
  response.headers.set('Access-Control-Max-Age', corsOptions.maxAge?.toString() ?? '')

  return response
}

export const config = {
  matcher: '/api/:path*',
}
