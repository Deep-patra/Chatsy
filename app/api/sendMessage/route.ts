import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { storeFile } from '@/utils/storage'
import { getUserFromSession } from '@/utils/getUserFromSession'
import { db } from '@/utils/firebase_admin_app'
import { logger } from '@/utils/logger'
import { processImage } from '@/utils/image_utils'

export const POST = async (req: NextRequest) => {
  try {
    const user = await getUserFromSession(req)

    const formdata = await req.formData()
    const chatroom_id = formdata.get('chatroom_id')
    const text = formdata.get('text')
    const image = formdata.get('image')

    if (!chatroom_id) throw new Error('ChatRoom ID is not present')

    if (!text && !image)
      throw new Error('message is empty. It should have a text or and image.')

    const obj = {} as any

    if (image && typeof image !== 'string') {
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

    await db.collection('messages').add({
      author: user.id,
      chatroom_id,
      time: FieldValue.serverTimestamp(),
      text: text ?? '',
      ...obj,
    })

    logger.info({
      message: {
        author_id: user.id,
        chatroom_id,
        ...obj,
      },
    })

    return new NextResponse(JSON.stringify({ result: 'ok' }), { status: 200 })
  } catch (e: any) {
    logger.error(e)
    return new NextResponse(
      JSON.stringify({ error: e.message || 'Invalid Request!' }),
      { status: 400 }
    )
  }
}
