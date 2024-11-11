import { db } from '@/utils/firebase_admin_app'

export const deleteAllDocs = async (...collections: string[]) => {
  for (const collection of collections) {
    const docs = (await db.collection(collection).get()).docs

    const promises = []
    const batch = db.batch()
    for (const doc of docs) promises.push(batch.delete(doc.ref))

    if (promises.length > 0) batch.commit()
  }
}
