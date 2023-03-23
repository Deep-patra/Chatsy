import getApp from '@/firebase'
import { getFirestore } from 'firebase/firestore'

const app = getApp()
const db = getFirestore(app)

export { db }
