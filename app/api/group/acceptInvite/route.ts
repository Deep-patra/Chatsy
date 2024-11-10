import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { db } from '@/utils/firebase_admin_app'
import { logger } from '@/utils/logger'

export const POST = async (req: NextRequest) => {

  try {
    const formdata = await req.formData()

    const user_id = formdata.get('user_id')
    const invite_id = formdata.get('invite_id')

    if (!user_id || !invite_id) 
      throw new Error("Request doesn't have required parameters")

    const inviteRef = db.collection('groupInvites').doc(String(invite_id))
    const inviteDoc = await inviteRef.get()

    if (inviteDoc.get('to') !== String(user_id)) 
      throw new Error ("Requested user doesn't match.")

    const groupRef = db.collection('groups').doc(String(inviteDoc.get('group_id')))
    const userRef = db.collection('users').doc(String(inviteDoc.get('to')))
   
    await db.runTransaction(async (t) => {
      // add member in the group
      t.update(groupRef, { members: FieldValue.arrayUnion(userRef.id) })
      
      // add group in the user
      t.update(userRef, {
        groups: FieldValue.arrayUnion(groupRef.id)
      })

      // delete invite 
      t.delete(inviteRef)
    })

    return new NextResponse(JSON.stringify({ result: 'ok' }), { status: 200 })

  } catch(e: any) {
    logger.error(e)
    return new NextResponse(
      JSON.stringify({ error: e.message || "Invalid Request" }),
      { status: 400 }
    )
  }
}
