import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getUserFromSession } from '@/utils/getUserFromSession'
import { db } from '@/utils/firebase_admin_app'
import { logger } from '@/utils/logger'

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromSession(req)

    const formdata = await req.formData()

    const group_id = formdata.get('group_id')

    if (!group_id) throw new Error('group id is not present')

    const group_ref = db.collection('groups').doc(String(group_id))
    const group_doc = await group_ref.get()

    if (!group_doc.exists)
      throw new Error(`Group with the group id ${group_id} doesn't exists`)

    const members = group_doc.get('members')

    // if the user is the admin of the group
    // delete the group and remove group from every member
    if (user.id == group_doc.get('admin')) {
      const batch = db.batch()

      const members_refs: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>[] =
        members.map((value: string) => db.collection('users').doc(value))

      // update every member in the group member list
      members_refs.forEach((ref) => {
        batch.update(ref, {
          groups: FieldValue.arrayRemove(group_ref.id),
        })
      })

      // delete the group
      batch.delete(group_ref)

      batch.commit()

      return new NextResponse(JSON.stringify({ result: 'ok' }), { status: 200 })
    }

    // if the user is not the admin, then
    // remove the group id from the user's groups list
    // remove user id from the group's members list

    const batch = db.batch()

    batch.update(group_ref, {
      members: FieldValue.arrayRemove(user.id),
    })

    batch.update(user.ref, {
      groups: FieldValue.arrayRemove(group_ref.id),
    })

    batch.commit()

    return new NextResponse(JSON.stringify({ result: 'ok' }), { status: 200 })
  } catch (error: any) {
    logger.error(error)
    return new NextResponse(
      JSON.stringify({ error: error.message || 'Invalid Request' }),
      { status: 400 }
    )
  }
}
