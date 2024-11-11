import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { generateAvatarForGroups } from '@/utils/image_utils'
import { processImage } from '@/utils/image_utils'
import { storeFile } from '@/utils/storage'
import { db } from '@/utils/firebase_admin_app'
import { logger } from '@/utils/logger'

export const POST = async (req: NextRequest) => {
  try {
    const formdata = await req.formData()

    const user_id = formdata.get('user_id')
    const name = formdata.get('name')
    const photo = formdata.get('photo')
    const description = formdata.get('description')

    if (!user_id) throw new Error('User ID is not present')

    if (!name || String(name).trim() === '')
      throw new Error('Groups needs a name!')

    const obj = {} as any
    obj.name = name

    // Check if the user exists
    const userRef = db.collection('users').doc(String(user_id))

    const doc = await userRef.get()

    if (!doc.exists) throw new Error("User doesn't exists")

    if (description) obj.description = String(description)

    if (photo instanceof File) {
      const uuid = crypto.randomUUID()
      const { thumbnail, original } = await processImage(
        formdata.get('photo') as File
      )

      const thumbnail_url = await storeFile(
        thumbnail,
        'thumbnails',
        `${uuid}-thumbnail.png`
      )
      const original_url = await storeFile(original, 'images', `${uuid}.png`)

      obj.photo = {
        uuid,
        thumbnail_url,
        original_url,
      }
    } else if (typeof photo === 'string') obj.photo = photo
    else obj.photo = await generateAvatarForGroups(String(name))

    const groupDoc = await db.collection('groups').add({
      admin: user_id,
      created: FieldValue.serverTimestamp(),
      members: [user_id],
      description: '',
      ...obj,
    })

    await userRef.update({
      groups: FieldValue.arrayUnion(groupDoc.id),
    })

    const _doc = await groupDoc.get()

    logger.info({ create: { group: { id: _doc.id, ..._doc.data() } } })

    return new NextResponse(JSON.stringify({ id: _doc.id, ..._doc.data() }), {
      status: 200,
    })
  } catch (e: any) {
    logger.error(e)
    return new NextResponse(
      JSON.stringify({ error: e.message || 'Invalid Request!' }),
      { status: 400 }
    )
  }
}
