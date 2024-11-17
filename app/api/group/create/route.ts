import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { generateAvatarForGroups } from '@/utils/image_utils'
import { processImage } from '@/utils/image_utils'
import { storeFile } from '@/utils/storage'
import { getUserFromSession } from '@/utils/getUserFromSession'
import { db } from '@/utils/firebase_admin_app'
import { logger } from '@/utils/logger'

export const POST = async (req: NextRequest) => {
  try {
    const user = await getUserFromSession(req)

    const formdata = await req.formData()

    const name = formdata.get('name')
    const photo = formdata.get('photo')
    const description = formdata.get('description')

    if (!name || String(name).trim() === '')
      throw new Error('Groups needs a name!')

    const obj = {} as any
    obj.name = name

    if (description) obj.description = String(description)

    if (photo && typeof photo !== 'string') {
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
      admin: user.id,
      created: FieldValue.serverTimestamp(),
      members: [user.id],
      description: '',
      ...obj,
    })

    await user.ref.update({
      groups: FieldValue.arrayUnion(groupDoc.id),
    })

    const _doc = await groupDoc.get()

    logger.info({ create: { group: { id: _doc.id, ..._doc.data() } } })

    return new NextResponse(JSON.stringify({ id: _doc.id, ..._doc.data() }))
  } catch (e: any) {
    logger.error(e)
    return new NextResponse(
      JSON.stringify({ error: e.message || 'Invalid Request!' }),
      { status: 400 }
    )
  }
}
