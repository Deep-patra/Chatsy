import { storage } from '@/utils/firebase_admin_app'

export const clearStorage = async (...buckets: string[]) => {
  for (const bucket of buckets) {
    await storage.bucket(bucket).deleteFiles()
  }
}
