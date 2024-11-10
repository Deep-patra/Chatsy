import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/utils/logger'
import { processImage } from '@/utils/image_utils'
import { storeFile, deleteFile } from '@/utils/storage'
import { db } from '@/utils/firebase_admin_app'

const deletePreviousPhoto = async (uuid: string) => {
  await Promise.allSettled([
    deleteFile(`${uuid}.png`, 'images'),
    deleteFile(`${uuid}-thumbnail.png`, 'thumbnails'),
  ])
}


export const POST = async (req: NextRequest) => {
  try {

    const formdata = await req.formData()

    const user_id = formdata.get('user_id')
    const name = formdata.get('name')
    const description = formdata.get('description')
    const photo = formdata.get('photo')

    if (!user_id)
      throw new Error("User ID is not present in the body.")

    const userRef = db.collection('users').doc(String(user_id))
    const userDoc = await userRef.get()

    const obj = {} as any

    if (name)
      obj.name = String(formdata.get('name'))

    if (description)
      obj.description = String(formdata.get('description'))

    if (photo instanceof File) {

      // cleanup previous files
      if (userDoc.get('photo') && typeof userDoc.get('photo') == 'object') {
        const { uuid } = userDoc.get('photo')

        // delete previous files
        if (uuid) await deletePreviousPhoto(uuid)
      }

      const { thumbnail, original } = await processImage(photo)
      const image_uuid = crypto.randomUUID()

      const thumbnail_url = await storeFile(thumbnail, 'thumbnails', `${image_uuid}-thumbnail.png`)
      const original_url = await storeFile(original, 'images', `${image_uuid}.png`)

      obj.photo = {
        uuid: image_uuid,
        thumbnail_url,
        original_url
      }
    } else if (typeof photo === "string")
        obj.photo = photo

    await db
        .collection('users')
        .doc(String(user_id))
        .update(obj)


    logger.info({ update: { user_id, changes: [ ...Object.keys(obj) ] } })

    const updatedDoc = await userRef.get()

    return new NextResponse(
      JSON.stringify({
        id: updatedDoc.id, ...updatedDoc.data(),
      })
    )
  } catch(e: any) {
    logger.error(e)

    return new NextResponse(
      JSON.stringify({ error: e.message && "Invalid Request!" }),
      { status: 400 }
    )
  }

}
