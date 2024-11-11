import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  type DocumentReference,
  type DocumentData,
} from 'firebase/firestore'
import { db } from '../../../services/db'

import { UserService } from '../../../services/user/service'

const user = { name: 'deep patra', description: '🤘 yo!' }
let userRef: DocumentReference<DocumentData> | null = null

beforeAll(async () => {
  // Adding a user
  userRef = await addDoc(collection(db, 'users'), {
    name: user.name,
    photo: null,
    description: user.description,
    contacts: [],
    groups: [],
    invites: [],
    created_at: serverTimestamp(),
  })
})

afterAll(async () => {
  // Deleting user
  if (userRef) await deleteDoc(doc(db, 'users', userRef.id))
})

it('Should get the User Document', async () => {
  if (!userRef) fail('User Ref is null')

  const user_doc = await UserService.get(userRef.id)

  if (!user_doc) fail('User document is undefined')

  expect(user_doc.name).toBe(user.name)
  expect(user_doc.description).toBe(user.description)

  expect(user_doc.contacts.length).toBe(0)
  expect(user_doc.groups.length).toBe(0)
  expect(user_doc.invites.length).toBe(0)

  expect(user_doc.created_at).toBeInstanceOf(Timestamp)
})
