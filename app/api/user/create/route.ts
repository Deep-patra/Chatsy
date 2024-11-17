import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { logger } from '@/utils/logger'
import { db } from '@/utils/firebase_admin_app'
import { generateAvatar, processImage } from '@/utils/image_utils'
import { storeFile } from '@/utils/storage'

export const POST = async (req: NextRequest) => {
  try {
    const formdata = await req.formData()

    const uid = formdata.get('uid')
    const name = formdata.get('name')
    const photo = formdata.get('photo')
    const description = formdata.get('description')
    const email = formdata.get('email')

    if (!uid) throw new Error('User UID is not present.')

    if (!email) throw new Error('User email is not present.')

    const obj = {} as any

    obj.uid = uid
    obj.email = email
    obj.name = name ? String(name) : ''
    obj.description = description ? String(description) : ''

    // check if the user with uid exists
    const snapshots = await db
      .collection('users')
      .where('uid', '==', obj.uid)
      .get()

    if (!snapshots.empty) throw new Error('User with the same UID exists!')

    if (photo && typeof photo !== 'string') {
      const imageFile = photo as File
      const { thumbnail, original } = await processImage(imageFile)

      const uuid = crypto.randomUUID()
      const original_url = await storeFile(original, 'images', `${uuid}.png`)
      const thumbnail_url = await storeFile(
        thumbnail,
        'thumbnails',
        `${uuid}-thumbnail.png`
      )

      obj.photo = {
        uuid,
        thumbnail_url,
        original_url,
      }
    } else if (typeof photo === 'string') {
      obj.photo = photo
    } else {
      const avatar = await generateAvatar(obj.name)
      obj.photo = avatar
    }

    const userRef = await db.collection('users').add({
      contacts: [],
      groups: [],
      created: FieldValue.serverTimestamp(),
      email: '',
      description: '',
      ...obj,
    })

    const userDoc = await userRef.get()

    return new NextResponse(
      JSON.stringify({ id: userRef.id, ...userDoc.data() })
    )
  } catch (e: any) {
    logger.error(e)

    return new NextResponse(
      JSON.stringify({ error: e.message || 'Invalid Request!' }),
      { status: 400 }
    )
  }
}
