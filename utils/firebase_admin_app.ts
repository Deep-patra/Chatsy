import {
  initializeApp,
  cert,
  getApps,
  App,
  ServiceAccount,
  Credential,
} from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import dotenv from 'dotenv'

dotenv.config({ path: './.env.local' })

const acc: ServiceAccount = {
  projectId: process.env.project_id,
  privateKey: process.env.private_key?.replace(/\\n/g, '\n'),
  clientEmail: process.env.client_email,
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert(acc),
  })
}

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
