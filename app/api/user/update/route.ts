import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/utils/logger'
import { processImage } from '@/utils/image_utils'
import { storeFile, deleteFile } from '@/utils/storage'
import { auth, db } from '@/utils/firebase_admin_app'
import { getUserFromSession } from '@/utils/getUserFromSession'

const deletePreviousPhoto = async (uuid: string) => {
  await Promise.allSettled([
    deleteFile(`${uuid}.png`, 'images'),
    deleteFile(`${uuid}-thumbnail.png`, 'thumbnails'),
  ])
}

export const POST = async (req: NextRequest) => {
  try {
    const user = await getUserFromSession(req)

    const formdata = await req.formData()

    const name = formdata.get('name')
    const description = formdata.get('description')
    const photo = formdata.get('photo')

    const obj = {} as any

    if (name) obj.name = String(formdata.get('name'))

    if (description) obj.description = String(formdata.get('description'))

    if (photo && typeof photo !== 'string') {
      // cleanup previous files
      if (user.get('photo') && typeof user.get('photo') == 'object') {
        const { uuid } = user.get('photo')

        // delete previous files
        if (uuid) await deletePreviousPhoto(uuid)
      }

      const { thumbnail, original } = await processImage(photo)
      const image_uuid = crypto.randomUUID()

      const thumbnail_url = await storeFile(
        thumbnail,
        'thumbnails',
        `${image_uuid}-thumbnail.png`
      )
      const original_url = await storeFile(
        original,
        'images',
        `${image_uuid}.png`
      )

      obj.photo = {
        uuid: image_uuid,
        thumbnail_url,
        original_url,
      }
    } else if (typeof photo === 'string') obj.photo = photo

    await user.ref.update(obj)

    logger.info({
      update: { user_id: user.id, changes: [...Object.keys(obj)] },
    })

    const updatedDoc = await user.ref.get()

    return new NextResponse(
      JSON.stringify({
        id: updatedDoc.id,
        ...updatedDoc.data(),
      })
    )
  } catch (e: any) {
    logger.error(e)

    return new NextResponse(
      JSON.stringify({ error: e.message && 'Invalid Request!' }),
      { status: 400 }
    )
  }
}
