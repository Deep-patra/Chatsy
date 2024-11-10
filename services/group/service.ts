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
  type DocumentSnapshot,
  type QuerySnapshot,
  type DocumentData,
  type Unsubscribe,
  type DocumentReference,
  Timestamp,
} from 'firebase/firestore'
import { IMessage } from '..'
import { db } from '../db'
import { Group } from './index'

interface IOptions {
  offset?: number
  limit?: number
  order?: 'asc' | 'desc'
}

export class GroupService {

  static async create(user_id: string, name: string, photo?: string | File, description?: string): Promise<any> {
    const formdata = new FormData()

    if (name === "") throw new Error("Group name cannot be a empty string.")

    formdata.append('user_id', user_id)
    formdata.append('name', name)
    photo && formdata.append('photo', photo)
    description && formdata.append('description', description)

    const response = await fetch('/api/group/create', {
      method: 'POST',
      body: formdata
    }).catch(console.error)

    if (!response || response.status !== 200)
      throw new Error("Error in response in the GroupService::create method")

    const json = await response.json()
    return json
  }

  static async getGroups(user_id: string): Promise<Group[]> {
    const userRef = doc(db, 'users', user_id)
    const userDoc = await getDoc(userRef)

    const userGroup_id = userDoc.get('groups')

    const groupDoc_promises: Promise<DocumentSnapshot<DocumentData>>[] =
    userGroup_id.map((id: string) => getDoc(doc(collection(db, 'groups'), id)))

    const groupDocs: DocumentSnapshot<DocumentData>[] = await Promise.all(groupDoc_promises)

    const groups: Group[] = []

    groupDocs.forEach((doc) => {
      if (!doc.exists()) return

      const { 
        name = '',
        photo = '',
        description = '',
        members = [],
        admin = '',
        created
      } = doc.data()

      groups.push(new Group(
        doc.id,
        {
          name,
          photo,
          description,
          memberIds: members,
          admin,
          created: Timestamp.fromMillis(created._seconds * 1000 + created._nanoseconds)
        }
      ))
    }) 

    return groups
  }

  static async updateGroup(
    user_id: string,
    group_id: string,
    data: { name?: string, text?: string, photo?: File } = {}
  ) {
    const formdata = new FormData()
    formdata.append('user_id', user_id)
    formdata.append('group_id', group_id)

    data.name && formdata.append('name', data.name)
    data.text && formdata.append('text', data.text)
    data.photo && formdata.append('photo', data.photo)

    const res = await fetch('/api/group/update', {
      method: 'POST',
      body: formdata
    })

    if (res.status != 200)
      throw new Error((await res.json()).error || "ERROR in GroupService::UpdateGroup")
   
    const json = await res.json()
    return json
  }

  static async sendMessage(user_id: string, group_id: string, text?: string, image?: File) {
    const formdata = new FormData()

    formdata.append('user_id', user_id)
    formdata.append('group_id', group_id)
    
    if (text && text.trim() !== "")
      text && formdata.append('text', text)

    if (image)
      formdata.append('image', image)

    const res = await fetch('/api/group/sendMessage', {
      method: 'POST',
      body: formdata
    })

    if (res.status != 200)
      throw new Error("ERROR in GroupService::SendMessage::Method")

    const json = await res.json()

    if (json.result !== 'ok')
      throw new Error("Response result is not ok")
  }

  static async sendInvite(group_id: string, user_id: string, contact_id: string): Promise<void> {
    const formdata = new FormData()

    formdata.append('group_id', group_id)
    formdata.append('user_id', user_id)
    formdata.append('receiver_id', contact_id)

    const response = await fetch('/api/group/sendInvite', {
      method: 'POST',
      body: formdata
    })

    if (response.status !== 200)
      throw new Error("response status is not 200")
  }

  static async removeMember(group_id: string, user_id: string, member_id: string): Promise<void> {
    const formdata = new FormData()

    formdata.append('group_id', group_id)
    formdata.append('user_id', user_id)
    formdata.append('member_id', member_id)

    const response = await fetch('/api/group/removeMember', {
      method: 'POST',
      body: formdata
    })

    if (response.status !== 200)
      throw new Error("Response status is not 200")
  }

  static async deleteGroup(group_id: string, user_id: string): Promise<void> {
    const formdata = new FormData()

    formdata.append('group_id', group_id)
    formdata.append('user_id', user_id)

    const response = await fetch('/api/group/delete', {
      method: 'POST',
      body: formdata
    })

    if (response.status !== 200)
      throw new Error("Response status is not 200")
  }

  static async getMessages(
    group_id: string,
    options: IOptions = { limit: 10, offset: 0, order: 'desc' }
  ): Promise<IMessage[]> {
    const q = query(
      collection(db, 'messages'),
      where("group_id", '==', group_id),
      orderBy('time', options.order),
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

  static listenForGroupChanges(group_id: string, cb: (snapshot: DocumentSnapshot<DocumentData>) => void): Unsubscribe {
    const ref = doc(collection(db, 'groups'), group_id)
    const unsubsribe = onSnapshot(ref, cb)
    return unsubsribe
  }

  static listenForMessages(
    group_id: string,
    cb: (snapshot: QuerySnapshot<DocumentData>) => void
  ): Unsubscribe {
    const q = query(collection(db, 'groupMessages'), where('group_id', '==', group_id), limit(10))
    const unsubscribe = onSnapshot(q, cb)
    return unsubscribe
  }

}
