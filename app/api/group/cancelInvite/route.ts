import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { db } from '@/utils/firebase_admin_app'
import { logger } from '@/utils/logger'

const getDoc = async (collection: string, id: string): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> | null> => {
  const ref = db.collection(collection).doc(id)
  const doc = await ref.get()

  if (!doc.exists)
    return null

  return doc
}

export const POST = async (req: NextRequest) => {

  try {
    const formdata = await req.formData()

    const user_id = formdata.get('user_id')
    const invite_id = formdata.get('invite_id')

    if (!user_id || !invite_id)
      throw new Error("Required parameters in the request are not present")

    const userDoc = await getDoc('users', String(user_id))

    if (!userDoc)
      throw new Error("User doesn't exists")

    const inviteDoc = await getDoc('groupInvites', String(invite_id))

    if (!inviteDoc)
      throw new Error("Invite doesn't exsits")


    if (inviteDoc.get('to') !== userDoc.id)
      throw new Error(`Invite doesn't refer to the user with the id ${String(user_id)}`)

    const groupDoc = await getDoc('groups', inviteDoc.get('group_id'))

    if (!groupDoc)
      throw new Error("Group doesn't exists")

    db.runTransaction(async (t) => {
      // update the user, insert the group id in the groups list
      t.update(userDoc.ref, { 
        groups: FieldValue.arrayUnion(groupDoc.id)
      })

      // update the group, insert the user id to the members list
      t.update(groupDoc.ref, {
        members: FieldValue.arrayUnion(userDoc.id)
      })

      // delete the invite doc
      t.delete(inviteDoc.ref)
    })

    return new NextResponse(JSON.stringify({ result: 'ok' }))

  } catch(error: any) {
    logger.error(error)
    return new NextResponse(JSON.stringify({ error: error.message ?? "Invalid Request" }), { status: 400 })
  }

}
