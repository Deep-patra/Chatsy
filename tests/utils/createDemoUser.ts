import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { db } from '@/utils/firebase_admin_app'

const DEFAULT = {
  name: '',
  uid: crypto.randomUUID(),
  description: '',
  contacts: [],
  groups: [],
  created: FieldValue.serverTimestamp()
}

interface IData {
  name?: string
  uid?: string
  description?: string
  contacts?: any[],
  groups?: string[],
  created?: Timestamp
}

export const createDemoUser = async (data: IData) => {
  const userRef = await db.collection('users').add({ ...DEFAULT, ...data })
  return userRef
}
