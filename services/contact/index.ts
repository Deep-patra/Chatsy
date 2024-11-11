import {
  doc,
  collection,
  getDoc,
  Timestamp,
  Unsubscribe,
  type DocumentSnapshot,
  type DocumentData,
  type QuerySnapshot,
  type DocumentReference,
} from 'firebase/firestore'
import { User } from '../user'
import { ContactService } from './service'
import { db } from '../db'
import type { IPhoto, ChatInterface, IMessage } from '..'
import log from '@/components/utils/log'

interface IParams {
  name: string
  chatroom_id: string
  description: string
  created: Timestamp
  photo: IPhoto | string
}

export class Contact implements ChatInterface {
  name: string
  chatroom_id: string
  description: string
  created: Timestamp
  photo: IPhoto | string

  chatroom: { id: string; members: User[] } | null = null
  messages: IMessage[] = []

  constructor(
    readonly id: string,
    { name, chatroom_id, description, created, photo }: IParams
  ) {
    this.name = name
    this.description = description
    this.created = created
    this.photo = photo
    this.chatroom_id = chatroom_id
  }

  static async getAll(user_id: string): Promise<Contact[]> {
    const userRef = doc(collection(db, 'users'), user_id)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) throw new Error("User doesn't exists")

    const contacts = userDoc.data()?.contacts || []

    if (contacts.length === 0) return []

    const data: DocumentSnapshot<DocumentData>[] = []
    for (const item of contacts)
      data.push(await getDoc(doc(collection(db, 'users'), item.user_id)))

    const results: Contact[] = []

    for (const item of data) {
      if (!item.exists()) continue

      const found = contacts.find((c: any) => c.user_id == item.id)

      if (!found) continue

      results.push(
        new Contact(item.id, {
          name: item.get('name'),
          chatroom_id: found.chatroom_id,
          description: item.get('description'),
          photo: item.get('photo'),
          created: item.get('created'),
        })
      )
    }

    log('results in Contacts.getAll() => ', results)

    // fill up thier chatroom fields
    const promises: Promise<void>[] = results.map((value) =>
      value.getChatroom()
    )
    await Promise.all(promises).catch(console.error)

    return results
  }

  static async get(user_id: string, chatroom_id: string): Promise<Contact> {
    const userRef = doc(collection(db, 'users'), user_id)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) throw new Error("User doesn't exsits")

    return new Contact(userDoc.id, {
      name: userDoc.get('name'),
      chatroom_id,
      description: userDoc.get('description'),
      photo: userDoc.get('photo'),
      created: userDoc.get('created'),
    })
  }

  async fetchMembersData(): Promise<void> {
    await this.getChatroom()
  }

  getUserInfo(user_id: string): User {
    if (!this.chatroom) throw new Error('Cannot get User')

    if (this.chatroom.members[0].id == user_id) return this.chatroom.members[0]

    if (this.chatroom.members[1].id == user_id) return this.chatroom.members[1]

    throw new Error('User not found')
  }

  async delete(user_id: string) {
    await ContactService.delete(user_id, this.id)
  }

  async getChatroom() {
    const chatroomDoc = await getDoc(
      doc(collection(db, 'chatrooms'), this.chatroom_id)
    )
    const memberIds: string[] = chatroomDoc.get('members')

    const members = await Promise.all([
      User.getUser(memberIds[0]),
      User.getUser(memberIds[1]),
    ])

    if (members[0] == null || members[1] == null)
      throw new Error('On of the member is not present')

    this.chatroom = { id: this.chatroom_id, members: members as any }
  }

  async sendMessage(user_id: string, data: { text?: string; image?: File }) {
    await ContactService.sendMessage(user_id, this.chatroom_id, data)
  }

  pushMessages(...messages: IMessage[]) {
    if (this.messages.length === 0) {
      this.messages = messages
      return
    }

    if (this.messages[0].time > messages[messages.length - 1].time)
      this.messages = messages.concat(this.messages)
    else if (this.messages[this.messages.length - 1].time < messages[0].time)
      this.messages = this.messages.concat(messages)
    else {
      const new_messages = this.messages.concat(...messages)

      new_messages.sort((a, b) => {
        if (a.time < b.time) return 1

        return -1
      })

      this.messages = new_messages
    }
  }

  async getMessages(options: {
    offset?: number
    limit?: number
    order?: 'asc' | 'desc'
  }): Promise<IMessage[]> {
    const messages = await ContactService.getMessages(this.chatroom_id, options)
    return messages || []
  }

  listenForChanges(
    cb: (snapshot: DocumentSnapshot<DocumentData>) => void
  ): Unsubscribe {
    const unsub = ContactService.listenForContactChanges(this.id, cb)
    return unsub
  }

  listenForMessages(
    cb: (snapshot: QuerySnapshot<DocumentData>) => void
  ): Unsubscribe {
    const unsub = ContactService.listenForMessages(this.chatroom_id, cb)
    return unsub
  }
}
