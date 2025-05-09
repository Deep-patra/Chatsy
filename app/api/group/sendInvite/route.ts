import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getUserFromSession } from '@/utils/getUserFromSession'
import { db } from '@/utils/firebase_admin_app'
import { logger } from '@/utils/logger'

export const POST = async (req: NextRequest) => {
  try {
    const user = await getUserFromSession(req)

    const formdata = await req.formData()

    const receiver_id = formdata.get('receiver_id')
    const group_id = formdata.get('group_id')

    if (!receiver_id || !group_id)
      throw new Error('Invalid request ! Required Parameters are not present.')

    const group_ref = db.collection('groups').doc(String(group_id))
    const group_doc = await group_ref.get()

    if (!group_doc.exists) throw new Error("Group doesn't exists")

    const data = group_doc.data()

    if (data && data.admin !== user.id)
      throw new Error('Only Group admin can send invites')

    if (String(receiver_id) in data?.members)
      throw new Error(`User with the id ${receiver_id} already in members list`)

    const invite_ref = await db.collection('groupInvites').add({
      from: user.id,
      group_id: group_id,
      to: receiver_id,
      time: FieldValue.serverTimestamp(),
    })

    const invite_doc = await invite_ref.get()

    return new NextResponse(
      JSON.stringify({ id: invite_doc.id, ...invite_doc.data() })
    )
  } catch (e: any) {
    logger.error(e)
    return new NextResponse(
      JSON.stringify({ error: e.message || 'Invalid Request!' }),
      { status: 400 }
    )
  }
}
