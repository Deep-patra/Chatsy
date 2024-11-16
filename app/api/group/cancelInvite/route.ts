import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getUserFromSession } from '@/utils/getUserFromSession'
import { db } from '@/utils/firebase_admin_app'
import { logger } from '@/utils/logger'

const getDoc = async (
  collection: string,
  id: string
): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> | null> => {
  const ref = db.collection(collection).doc(id)
  const doc = await ref.get()

  if (!doc.exists) return null

  return doc
}

export const POST = async (req: NextRequest) => {
  try {
    const user = await getUserFromSession(req)

    const formdata = await req.formData()

    const invite_id = formdata.get('invite_id')

    if (!invite_id)
      throw new Error('invite id is not present in the request')

    const inviteDoc = await getDoc('groupInvites', String(invite_id))

    if (!inviteDoc) 
      throw new Error("Invite doesn't exsits")

    const groupDoc = await getDoc('groups', inviteDoc.get('group_id'))

    if (!groupDoc) throw new Error("Group doesn't exists")

    await inviteDoc.ref.delete()

    return new NextResponse(JSON.stringify({ result: 'ok' }))
  } catch (error: any) {
    logger.error(error)
    return new NextResponse(
      JSON.stringify({ error: error.message ?? 'Invalid Request' }),
      { status: 400 }
    )
  }
}
