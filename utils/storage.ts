import crypto from 'node:crypto'
import sharp from 'sharp'
import { storage } from './firebase_admin_app'


export const storeFile = async (buffer: Buffer, bucket: string, filename: string): Promise<string> => {

  const fileRef = storage.bucket(bucket).file(filename)
  await fileRef.save(Buffer.from(buffer), { contentType: 'image/png' })
  return fileRef.publicUrl()
}

export const deleteFile = async (filename: string, bucket: string): Promise<void> => {
  const fileRef = storage.bucket(bucket).file(filename)

  if (await fileRef.exists()) 
    await fileRef.delete()
}


