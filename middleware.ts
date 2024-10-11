import { NextResponse, type NextRequest } from 'next/server'

const checkSession = (session_id: string): boolean => {
  return false
}

export function middleware(request: NextRequest) {
  // Forgot Password route
  if (request.nextUrl.pathname.startsWith('/forgot_password')) {
    const { session_id } = request.nextUrl.searchParams as any

    console.log(session_id)

    // if the session_id is not present
    // redirect it to error pag
    if (!session_id) {
      return NextResponse.redirect(
        new URL('/notFound?error_code=404', request.url)
      )
    }

    // check if the session_id is valid
    if (!checkSession(session_id))
      return NextResponse.redirect(
        new URL('/notFound?error_code=403', request.url)
      )
  }
}

export const config = {
  matcher: '/forgot_password',
}
