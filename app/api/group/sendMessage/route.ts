import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { processImage } from '@/utils/image_utils'
import { storeFile } from '@/utils/storage'
import { getUserFromSession } from '@/utils/getUserFromSession'
import { db } from '@/utils/firebase_admin_app'
import { logger } from '@/utils/logger'

export const POST = async (req: NextRequest) => {
  try {
    const user = await getUserFromSession(req)

    const formdata = await req.formData()

    const group_id = formdata.get('group_id')
    const text = formdata.get('text')
    const image = formdata.get('images')

    if (!group_id)
      throw new Error('User ID or Group ID is not present')

    if (!text && !image)
      throw new Error("Message doesn't have a text or a image")

    const obj = {} as any

    obj.text = text ?? ''

    if (image) {
      const imageFile = image as File

      const { thumbnail, original } = await processImage(imageFile)

      const uuid = crypto.randomUUID()
      const thumbnail_url = await storeFile(
        thumbnail,
        'thumbnails',
        `${uuid}-thumbnail.png`
      )
      const original_url = await storeFile(original, 'images', `${uuid}.png`)

      obj.images = {
        uuid,
        thumbnail_url,
        original_url,
      }
    }

    const messageRef = await db.collection('groupMessages').add({
      author: user.id,
      group_id: group_id,
      time: FieldValue.serverTimestamp(),
      ...obj,
    })

    return new NextResponse(JSON.stringify({ result: 'ok' }))
  } catch (e: any) {
    logger.error(e)
    return new NextResponse(
      JSON.stringify({ error: e.message || 'Invalid Request' }),
      { status: 400 }
    )
  }
}
