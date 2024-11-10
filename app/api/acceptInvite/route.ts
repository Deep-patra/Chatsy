import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { db } from '@/utils/firebase_admin_app'
import { logger } from '@/utils/logger'

export const POST = async (req: NextRequest) => {

  try {
    const formdata = await req.formData()

    const invite_id = String(formdata.get('invite_id'))
    const user_id = String(formdata.get('user_id'))

    if (!invite_id)
      throw new Error("Invite ID is not present!")

    const invite_doc_ref = db.collection('invites').doc(invite_id)
    const invite_doc = await invite_doc_ref.get()

    if (user_id != invite_doc.get('to'))
      throw new Error("User ID doesn't match.")

    const to_id = user_id
    const from_id = invite_doc.get('from')

    const toRef = db.collection('users').doc(user_id)
    const fromRef =  db.collection('users').doc(from_id)


    const user1Doc = await toRef.get()
    const user2Doc = await fromRef.get()

    if (user1Doc && !user1Doc.exists && user2Doc && !user2Doc.exists)
      throw new Error("One of the User doesn't exists")


    // create a chatroom 
    const chatRoom_doc = await db.collection('chatrooms').add({
      members: [toRef.id, fromRef.id],
    })

    await db.runTransaction(async (transaction) => {

      // add the contact to the user doc
      transaction.update(fromRef, {
        contacts: FieldValue.arrayUnion({ chatroom_id: chatRoom_doc.id, user_id: to_id }),
      })

      // add the contact in the receiver doc
      transaction.update(toRef, {
        contacts: FieldValue.arrayUnion({ chatroom_id: chatRoom_doc.id, user_id: fromRef.id })
      })

      // delete the invite doc
      transaction.delete(invite_doc_ref)
    })

    logger.info({
      acceptRequest: {
        from: fromRef.id,
        to: toRef.id,
        invite_id: invite_doc_ref.id
      },
    })

    return new NextResponse(JSON.stringify({ result: 'ok' }))

  } catch(error: any) {
    logger.error(error)
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 400 })
  }
}
