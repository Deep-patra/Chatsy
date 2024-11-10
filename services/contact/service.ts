import {
  doc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  Timestamp,
  type DocumentSnapshot,
  type QuerySnapshot,
  type DocumentData,
  type Unsubscribe
} from 'firebase/firestore'
import { Contact } from './index'
import { db } from '../db'
import { IMessage } from '..'

interface IOptions {
  offset?: number
  limit?: number
  order?: 'asc' | 'desc'
}

export class ContactService {
  static async getAll(user_id: string) {
    const userRef = doc(collection(db, 'groups'), user_id)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) 
      throw new Error("User Doesn't exists")

    const contactRefs: { chatroom_id: string, user_id: string }[] = userDoc.data().contacts
    const contact_promises = contactRefs.map((item) => getDoc(doc(collection(db, 'users'), item.user_id)))

    const contact_docs: DocumentSnapshot<DocumentData>[] = await Promise.all(contact_promises)

    const contacts: Contact[] = []

    contact_docs.forEach((doc) => {
      if (!doc.exists())
        return

      const item = contactRefs.find((ref) => ref.user_id == doc.id)
      const { name, photo, description, created } = doc.data()

      if (!item) return

      contacts.push(new Contact(doc.id, {
        chatroom_id: item.chatroom_id,
        photo,
        name,
        description,
        created,
      }))
    })

    return contacts
  }

  static async sendMessage(
    user_id: string,
    chatroom_id: string,
    data: { text?: string, image?: File}
  ): Promise<void> {
    const formdata = new FormData()

    formdata.append('user_id', user_id)
    formdata.append('chatroom_id', chatroom_id)

    if (data.text && data.text.trim() !== '')
      formdata.append('text', data.text)

    if (data.image)
      formdata.append('image', data.image)

    const res = await fetch('/api/sendMessage', {
      method: 'POST',
      body: formdata
    })

    if (res.status != 200)
      throw new Error("Response status is not 200")

    const json = await res.json()

    if (json.result !== 'ok')
      throw new Error("Response result is not ok")
  }

  static async getMessages(chatroom_id: string, options: IOptions = { limit: 10, order: 'desc', offset: 0 }): Promise<IMessage[]> {
    const q = query(
      collection(db, 'messages'),
      where("chatroom_id", '==', chatroom_id),
      orderBy('time', options.order || 'desc'),
      limit(options.limit || 10),
      startAfter(options.offset || 0)
    )

    const querySnapshots = await getDocs(q)

    const messages: IMessage[] = []

    querySnapshots.forEach((snap) => {
      if (!snap.exists()) return

      const data = snap.data()

      messages.push({
        id: snap.id,
        text: data.text || '',
        images: data.images || null,
        time: data.time,
        author: data.author,
      })
    })

    return messages
  }

  static async delete(user_id: string, contact_id: string): Promise<void> {
    const formdata = new FormData()

    formdata.append('user_id', user_id)
    formdata.append('contact_id', contact_id)

    const response = await fetch('/api/user/deleteContact', {
      method: 'POST',
      body: formdata 
    })

    if (response.status !== 200)
      throw new Error("Response status is not 200")
  }

  static listenForContactChanges(user_id: string, cb: (snapshot: DocumentSnapshot<DocumentData>) => void): Unsubscribe {
    const q = doc(collection(db, 'users'), user_id)
    const unsubscribe = onSnapshot(q, cb)
    return unsubscribe
  }

  static listenForMessages(chatroom_id: string, cb: (snapshot: QuerySnapshot<DocumentData>) => void): Unsubscribe {
    const q = query(collection(db, 'messages'), where('chatroom_id', '==', chatroom_id), limit(10), orderBy('time', 'desc'))
    const unsubscribe = onSnapshot(q, cb)
    return unsubscribe
  }
}
