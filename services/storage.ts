import { getApp, useEmulators } from '@/firebase'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

const app = getApp()
const storage = getStorage(app)

// Use the local storage emulator for development
if (useEmulators()) {
  connectStorageEmulator(storage, 'localhost', 9199)
  console.info('Using Local Storage Emulator for Development')
}

export { storage }
