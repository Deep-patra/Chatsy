import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { db } from '@/utils/firebase_admin_app'
import { logger } from '@/utils/logger'

export const POST = async (req: NextRequest) => {
  try {
    const formdata = await req.formData()

    const user_id = String(formdata.get('from'))
    const receiver_id = String(formdata.get('to'))

    if (!user_id || !receiver_id)
      throw new Error('User Id or Receiver Id is not present')

    const user = await db.collection('users').doc(user_id).get()
    const receiver = await db.collection('users').doc(receiver_id).get()

    if (!user.exists || !receiver.exists)
      throw new Error("One of the user doesn't exists.")

    const invite_doc_ref = await db.collection('invites').add({
      from: user_id,
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
