import { NextRequest, NextResponse } from 'next/server'
import { getServerSession  } from '@/lib/session'

export async function proxy(req: NextRequest) {

        const session = await getServerSession(req);

    const isAuthPage = 
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/signUp');

    if (!session && !isAuthPage) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

   if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/signUp'],
}
