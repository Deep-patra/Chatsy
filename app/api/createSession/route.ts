import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/utils/firebase_admin_app'
import { logger } from '@/utils/logger'

export const POST = async (req: NextRequest) => {
  try {
    const json = await req.json()

    const { token } = json

    if (!token) throw new Error('Token is not present')

    // expiration time to 1 hour
    const expiresIn = 1000 * 60 * 60

    const verify = await auth.verifyIdToken(token, true).catch(console.error)

    if (!verify) throw new Error('token is not verified')

    const session = await auth.createSessionCookie(token, { expiresIn })

    const res = new NextResponse(JSON.stringify({ result: 'ok' }))
    res.cookies.set('session', session, {
      maxAge: expiresIn,
      secure: true,
      httpOnly: true,
    })

    logger.info({ session })

    return res
  } catch (error: any) {
    logger.error(error)
    return new NextResponse(
      JSON.stringify({ error: error.message || 'Invalid Request' }),
      { status: 400 }
    )
  }
}
