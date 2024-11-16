import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getUserFromSession } from '@/utils/getUserFromSession'
import { db } from '@/utils/firebase_admin_app'
import { logger } from '@/utils/logger'

export const POST = async (req: NextRequest) => {
  try {
    const user = await getUserFromSession(req)

    const formdata = await req.formData()

    const receiver_id = String(formdata.get('to'))

    if (!receiver_id)
      throw new Error('receiver Id is not present')

    const receiver = await db.collection('users').doc(receiver_id).get()

    if (!receiver.exists)
      throw new Error(`user with id ${receiver_id} doesn't exists.`)

    const invite_doc_ref = await db.collection('invites').add({
      from: user.id,
      to: receiver_id,
      time: FieldValue.serverTimestamp(),
    })

    if (!invite_doc_ref) throw new Error('Cannot create Invite')

    const doc = await invite_doc_ref.get()
    return new NextResponse(
      JSON.stringify({
        id: doc.id,
        ...doc.data(),
      })
    )
  } catch (e: any) {
    logger.error(e)
    return new NextResponse(
      JSON.stringify({ error: e.message || 'Invalid request' }),
      { status: 400 }
    )
  }
}
