import crypto from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
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
    const name = formdata.get('name')
    const description = formdata.get('description')
    const photo = formdata.get('photo')

    if (!group_id)
      throw new Error(`group id ${group_id} is not present!`)

    // check if the user is the admin of the group
    const groupRef = db.collection('groups').doc(String('group_id'))
    const groupDoc = await groupRef.get()

    if (groupDoc.get('admin') !== user.id)
      throw new Error('User is not the admin of the group.')

    const obj = {} as any

    if (name) obj.name = String(name)

    if (description) obj.description = String(description)

    if (photo) {
      if (typeof photo === 'string') obj.photo = photo

      const imageFile = formdata.get('photo') as File
      const { thumbnail, original } = await processImage(imageFile)

      const uuid = crypto.randomUUID()
      const original_url = await storeFile(original, 'images', `${uuid}.png`)
      const thumbnail_url = await storeFile(
        thumbnail,
        'thumbnails',
        `${uuid}-thumhnail.png`
      )

      obj.photo = {
        uuid,
        original_url,
        thumbnail_url,
      }
    }

    await groupRef.update({ ...obj })
    const newDoc = await groupRef.get()

    return new NextResponse(
      JSON.stringify({
        result: 'ok',
        group: { group_id: groupRef.id, ...newDoc.data() },
      })
    )
  } catch (e: any) {
    logger.error(e)
    return new NextResponse(
      JSON.stringify({ error: e.message || 'Invalid Request!' }),
      { status: 400 }
    )
  }
}
