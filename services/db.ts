import { getApp, useEmulators } from '@/firebase'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const app = getApp()
const db = getFirestore(app)

// Use the local emulator for Development
if (useEmulators()) {
  console.info('Using Local Firestore Emulator for Development')
  connectFirestoreEmulator(db, 'localhost', 8080)
}

export { db }
