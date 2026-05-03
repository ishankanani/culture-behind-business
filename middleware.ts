import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const protectedPaths = [
    '/dashboard',
    '/manage-episodes',
    '/subscribers',
    '/contacts',
    '/newsletter',
    '/settings',
    '/site-settings',
    '/categories',
  ]

  const isProtected = protectedPaths.some(p =>
    pathname === p || pathname.startsWith(p + '/')
  )

  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get('admin_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-change-in-production')
    return NextResponse.next()
  } catch {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('admin_token')
    return response
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/manage-episodes/:path*',
    '/subscribers/:path*',
    '/contacts/:path*',
    '/newsletter/:path*',
    '/settings/:path*',
    '/site-settings/:path*',
    '/categories/:path*',
  ],
}
