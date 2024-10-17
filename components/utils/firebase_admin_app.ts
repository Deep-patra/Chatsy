import { initializeApp, applicationDefault, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

const serviceAccount = require('../../chatsy-456-firebase-admin.json')

initializeApp({
  credential: cert(serviceAccount)
})

export const db = getFirestore()
export const storage = getStorage()
