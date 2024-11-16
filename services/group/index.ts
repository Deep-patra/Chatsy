import {
  getDoc,
  doc,
  collection,
  Timestamp,
  Unsubscribe,
  type DocumentSnapshot,
  type QuerySnapshot,
  type DocumentData,
} from 'firebase/firestore'
import { GroupService } from './service'
import { User } from '../user'
import { db } from '../db'
import type { IPhoto, ChatInterface, IMessage } from '..'
import log from '@/components/utils/log'

interface IParam {
  name: string
  photo: IPhoto | string
  description: string
  memberIds: string[]
  admin: string
  created: Timestamp
}

export class Group implements ChatInterface {
  readonly name: string
  readonly photo: IPhoto | string
  readonly description: string
  readonly memberIds: string[]
  readonly created: Timestamp
  readonly admin: string

  messages: IMessage[] = []
  members: User[] = []

  constructor(
    readonly id: string,
    { name, photo, description, memberIds, admin, created }: IParam
  ) {
    this.name = name
    this.photo = photo
    this.description = description
    this.memberIds = memberIds
    this.admin = admin
    this.created = created
  }

  static async create(
    user_id: string,
    data: { name: string; photo?: string | File; description?: string }
  ): Promise<Group> {
    const result = await GroupService.create(
      user_id,
      data.name,
      data.photo,
      data.description
    )

    const group = new Group(result.id, {
      name: result.name,
      description: result.description,
      photo: result.photo,
      memberIds: result.members,
      admin: result.admin,
      created: result.created,
    })

    return group
  }

  static async getAll(user_id: string): Promise<Group[]> {
    const userRef = doc(collection(db, 'users'), user_id)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) throw new Error("User doesn't exists")

    const groups: string[] = userDoc.get('groups')

    if (groups.length === 0) return []

    const promises = groups.map((id) =>
      getDoc(doc(collection(db, 'groups'), id))
    )

    const data = await Promise.all(promises)

    const results: Group[] = []

    for (const d of data) {
      if (!d.exists()) continue

      results.push(
        new Group(d.id, {
          name: d.get('name'),
          description: d.get('description'),
          photo: d.get('photo'),
          memberIds: d.get('members'),
          admin: d.get('admin'),
          created: d.get('created'),
        })
      )
    }

    return results
  }

  static async get(group_id: string): Promise<Group> {
    const groupRef = doc(collection(db, 'groups'), group_id)
    const groupDoc = await getDoc(groupRef)

    if (!groupDoc.exists()) throw new Error("Group doesn't exists")

    const data = groupDoc.data()

    return new Group(groupDoc.id, {
      name: data.name,
      description: data.description,
      photo: data.photo,
      memberIds: data.members,
      admin: data.admin,
      created: data.created,
    })
  }

  async fetchMembersData(): Promise<void> {
    await this.getMembers()
  }

  getUserInfo(user_id: string): User | null {
    const user = this.members.find((m) => m.id === user_id)

    if (user == null) {
      log('Cannot find member with user id => ', user_id, this.members)
      return null
    }

    log('member => ', user)

    return user
  }

  async getMembers(): Promise<void> {
    const promises = this.memberIds.map((id) => {
      return User.getUser(id)
    })

    const members = await Promise.all(promises)
    this.members = members
  }

  private checkIfMessageAlreadyPresent(
    messages: IMessage[],
    message: IMessage
  ): boolean {
    const found = messages.find((m) => m.id === message.id)
    return !!found
  }

  pushMessages(...messages: IMessage[]) {
    let new_messages = this.messages

    if (this.messages.length === 0) {
      this.messages = new_messages.concat(messages)
      return
    }

    messages.forEach((m) => {
      if (this.checkIfMessageAlreadyPresent(new_messages, m)) return

      if ((new_messages[0].time as Timestamp).toDate() > m.time.toDate())
        new_messages = [m].concat(new_messages)
      else if (
        new_messages[new_messages.length - 1].time.toDate() < m.time.toDate()
      )
        new_messages = new_messages.concat(m)
      else {
        const index = new_messages.findIndex(
          (item) => item.time.toDate() < m.time.toDate()
        )
        new_messages = [
          ...new_messages.slice(0, index + 1),
          m,
          ...new_messages.slice(index + 1, new_messages.length),
        ]
      }
    })

    this.messages = new_messages
  }

  async sendInvite(user_id: string, receiver_id: string): Promise<void> {
    await GroupService.sendInvite(this.id, user_id, receiver_id)
  }

  async removeMember(user_id: string, member_id: string): Promise<void> {
    await GroupService.removeMember(this.id, user_id, member_id)
  }

  async delete(user_id: string): Promise<void> {
    await GroupService.deleteGroup(this.id, user_id)
  }

  async getMessages(options: {
    offset?: number
    limit?: number
    order?: 'asc' | 'desc'
  }): Promise<IMessage[]> {
    const messages = await GroupService.getMessages(this.id, options)
    return messages || []
  }

  async sendMessage(user_id: string, data: { text?: string; image?: File }) {
    await GroupService.sendMessage(user_id, this.id, data.text, data.image)
  }

  listenForChanges(
    cb: (snapshot: DocumentSnapshot<DocumentData>) => void
  ): Unsubscribe {
    const unsub = GroupService.listenForGroupChanges(this.id, cb)
    return unsub
  }

  listenForMessages(
    cb: (snapshot: QuerySnapshot<DocumentData>) => void
  ): Unsubscribe {
    const unsub = GroupService.listenForMessages(this.id, cb)
    return unsub
  }
}
