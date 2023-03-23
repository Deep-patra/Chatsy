import getApp from '@/firebase'
import { getStorage } from 'firebase/storage'

const app = getApp()
const storage = getStorage(app)

export { storage }
