import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { db } from '@/utils/firebase_admin_app'
import { logger } from '@/utils/logger'

export const POST = async (req: NextRequest) => {
  try {
    const formdata = await req.formData()

    const group_id = formdata.get('group_id')
    const user_id = formdata.get('user_id')
    const member_id = formdata.get('member_id')

    if (!group_id || !user_id || !member_id)
      throw new Error('Required parameters are not present in the request body')

    // check if the user is the admin of the group
    const groupRef = db
      .collection('groups')
      .doc(String(formdata.get('group_id')))
    const groupDoc = await groupRef.get()

    if (groupDoc.get('admin_id') !== String(formdata.has('user_id')))
      throw new Error('User is not the admin of the group.')

    const userRef = db
      .collection('users')
      .doc(String(formdata.get('member_id')))
    const userDoc = await userRef.get()

    if (!userDoc.exists) throw new Error("Member doesn't exists")

    await db.runTransaction(async (t) => {
      t.update(groupRef, {
        members: FieldValue.arrayRemove(String(formdata.get('group_id'))),
      })

      t.update(userRef, {
        groups: FieldValue.arrayRemove(userRef.id),
      })
    })

    logger.info({
      remove_member: {
        group_id: groupRef.id,
        member_id: String(formdata.get('member_id')),
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
