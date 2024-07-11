import { NextResponse } from 'next/server'
import { UserRole } from '@prisma/client'
import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'

const MEMBER_ADMIN_ROUTES = ['/admin/indicadores', '/admin/obras']

export default withAuth(
  async function middleware(req) {
    const requestedPath = req.nextUrl.pathname
    const token = await getToken({ req })
    const isAuth = !!token

    if (!isAuth) {
      let from = requestedPath
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(new URL(`/?from=${encodeURIComponent(from)}`, req.url))
    }

    if (token.role === UserRole.MEMBER) {
      if (!MEMBER_ADMIN_ROUTES.some((route) => requestedPath.startsWith(route))) {
        return NextResponse.redirect(new URL('/?error=unauthorized', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true
      },
    },
  },
)
export const config = { matcher: ['/admin/:path*'] }
