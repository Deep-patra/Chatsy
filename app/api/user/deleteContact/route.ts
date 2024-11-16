import { NextRequest, NextResponse } from 'next/server'
import { getUserFromSession } from '@/utils/getUserFromSession'
import { logger } from '@/utils/logger'
import { db } from '@/utils/firebase_admin_app'

type ContactType = { chatroom_id: string; user_id: string }
const updateContacts = (
  contacts: ContactType[],
  user_id: string
): ContactType[] => {
  const new_contacts = contacts.filter((value) =>
    value.user_id === user_id ? undefined : value
  )

  return new_contacts || []
}

export const POST = async (req: NextRequest) => {
  try {
  
    const user = await getUserFromSession(req)

    const formdata = await req.formData()

    const contact_id = formdata.get('contact_id')

    if (!contact_id)
      throw new Error('contact id is not present in the request body')

    const userRef = user.ref
    const contactRef = db.collection('users').doc(String(contact_id))

    // delete entries from both user and the contact
    await db.runTransaction(async (t) => {
      const userDoc = await t.get(userRef)
      const contactDoc = await t.get(contactRef)

      if (userDoc.exists)
        t.update(userRef, {
          contacts: updateContacts(
            userDoc.data() ? userDoc.data()?.contacts ?? [] : [],
            contactRef.id
          ),
        })

      if (contactDoc.exists)
        t.update(contactRef, {
          contacts: updateContacts(
            contactDoc.data() ? contactDoc.data()?.contacts ?? [] : [],
            userRef.id
          ),
        })

      const { chatroom_id } = userDoc
        .get('contacts')
        .find((value: any) => value.user_id === contact_id)

      if (chatroom_id) t.delete(db.collection('chatooms').doc(chatroom_id))
    })

    logger.info({
      delete: {
        user_id: String(formdata.get('user_id')),
        contact_id: String(formdata.get('contact_id')),
      },
    })

    return new NextResponse(JSON.stringify({ results: 'ok' }), { status: 200 })
  } catch (e: any) {
    logger.error(e)

    return new NextResponse(
      JSON.stringify({ error: e.message || 'Invalid request!' }),
      { status: 400 }
    )
  }
}
