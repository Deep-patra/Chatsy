import { NextRequest, NextResponse } from 'next/server'
import { getUserFromSession } from '@/utils/getUserFromSession'
import { logger } from '@/utils/logger'
import { db } from '@/utils/firebase_admin_app'

export const POST = async (req: NextRequest) => {
  try {
    const user = await getUserFromSession(req)

    const formdata = await req.formData()
    const invite_id = formdata.get('invite_id')

    if (!invite_id) throw new Error('User Id or Invite Id is not present')

    const invite_ref = db.collection('invites').doc(String(invite_id))
    const invite_doc = await invite_ref.get()

    if (invite_doc.get('from') !== user.id || invite_doc.get('to') !== user.id)
      throw new Error('Invalid User')

    await invite_ref.delete()

    return new NextResponse(JSON.stringify({ result: 'ok' }))
  } catch (error: any) {
    logger.error(error)
    new NextResponse(JSON.stringify({ error: error.message || 'Error' }), {
      status: 400,
    })
  }
}
