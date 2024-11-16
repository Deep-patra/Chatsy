import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getUserFromSession } from '@/utils/getUserFromSession'
import { db } from '@/utils/firebase_admin_app'
import { logger } from '@/utils/logger'

export const POST = async (req: NextRequest) => {
  try {
    const user = await getUserFromSession(req)

    const formdata = await req.formData()

    const invite_id = formdata.get('invite_id')

    if (!invite_id)
      throw new Error("invite id is not present in the request")

    const inviteRef = db.collection('groupInvites').doc(String(invite_id))
    const inviteDoc = await inviteRef.get()

    if (inviteDoc.get('to') !== user.id)
      throw new Error("Requested user doesn't match.")

    const groupRef = db
      .collection('groups')
      .doc(String(inviteDoc.get('group_id')))
    const userRef = db.collection('users').doc(String(inviteDoc.get('to')))

    await db.runTransaction(async (t) => {
      // add member in the group
      t.update(groupRef, { members: FieldValue.arrayUnion(userRef.id) })

      // add group in the user
      t.update(userRef, {
        groups: FieldValue.arrayUnion(groupRef.id),
      })

      // delete invite
      t.delete(inviteRef)
    })

    return new NextResponse(JSON.stringify({ result: 'ok' }), { status: 200 })
  } catch (e: any) {
    logger.error(e)
    return new NextResponse(
      JSON.stringify({ error: e.message || 'Invalid Request' }),
      { status: 400 }
    )
  }
}
