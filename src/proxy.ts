import NextAuth from "next-auth"
import { NextResponse } from "next/server"

import { authConfig } from "@/lib/auth.config"

const { auth } = NextAuth(authConfig)

const publicRoutes = ["/login", "/register"]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isPublicRoute = publicRoutes.includes(pathname)

  if (!req.auth && !isPublicRoute) {
    const loginUrl = new URL("/login", req.nextUrl.origin)
    return NextResponse.redirect(loginUrl)
  }

  if (req.auth && isPublicRoute) {
    const dashboardUrl = new URL("/dashboard", req.nextUrl.origin)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
