import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getUserFromSession } from '@/utils/getUserFromSession'
import { db } from '@/utils/firebase_admin_app'
import { logger } from '@/utils/logger'

export const POST = async (req: NextRequest) => {
  try {
    const user = await getUserFromSession(req)

    const formdata = await req.formData()

    const group_id = formdata.get('group_id')
    const member_id = formdata.get('member_id')

    if (!group_id || !member_id)
      throw new Error('Required parameters are not present in the request body')

    // check if the user is the admin of the group
    const groupRef = db.collection('groups').doc(String(group_id))
    const groupDoc = await groupRef.get()

    if (groupDoc.get('admin') !== user.ref.id)
      throw new Error('User is not the admin of the group.')

    await db.runTransaction(async (t) => {
      t.update(groupRef, {
        members: FieldValue.arrayRemove(String(member_id)),
      })

      t.update(user.ref, {
        groups: FieldValue.arrayRemove(String(group_id)),
      })
    })

    logger.info({
      remove_member: {
        group_id: groupRef.id,
        member_id: String(member_id),
      },
    })

    return new NextResponse(JSON.stringify({ result: 'ok' }))
  } catch (e: any) {
    logger.error(e)
    return new NextResponse(
      JSON.stringify({ error: e.message || 'Invalid Request!' }),
      { status: 400 }
    )
  }
}
