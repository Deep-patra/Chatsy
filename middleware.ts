import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  //
  // if (request.nextUrl.pathname.startsWith('/getDetails') || request.nextUrl.pathname.startsWith('/home')) {
  //   
  //   const session = request.cookies.get('session')
  //
  //   if (!session)
  //     return NextResponse.redirect(new URL('/login', request.url))
  //
  //   const claims = await auth.verifySessionCookie(session.value, true)
  //
  //   if (!claims)
  //     return NextResponse.redirect(new URL('/login', request.url))
  //
  //   const { uid } = claims
  //
  //   // get the user document
  //   const snapshots = await db.collection('users').where("uid", "==", uid).limit(1).get()
  //
  //   // the user doesn't exists, redirect to signup
  //   if (snapshots.size === 0)
  //     return NextResponse.redirect(new URL('/signup', request.url))
  //
  //   const doc = snapshots.docs[0]
  //
  //   // set the context, so the api route can use them
  //   setContext(request, doc)
  // }
}
