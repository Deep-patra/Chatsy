import {
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  type DocumentData,
  type DocumentSnapshot,
} from 'firebase/firestore'
import { UserService } from './service'
import { Contact } from '../contact'
import { Group } from '../group'
import { Unsubscribe } from 'firebase/auth'
import { db } from '@/services/db'
import type { IPhoto } from '@/services'


export class User {
  id: string
  name: string
  description: string
  photo: IPhoto | string
  contactIds: {chatroom_id: string, user_id: string}[] = []
  groupIds: string[] = []
  created: Timestamp

  groups: Group[] = []
  contacts: Contact[] = []

  constructor(
     id: string,
     name: string,
     description: string,
     photo: IPhoto | string,
     contactIds: { chatroom_id: string, user_id: string}[],
     groupIds: string[],
     created: Timestamp
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.photo = photo
    this.contactIds = contactIds || []
    this.groupIds = groupIds || []
    this.created = created
  }

  static async create(uid: string, email: string, name?: string): Promise<User> {
    const data = await UserService.create(uid, email, name)

    if (!data)
      throw new Error("Cannot create the User Document")

    const user = new User(
      data.id,
      data.name,
      data.description,
      data.photo,
      data.contacts,
      data.groups,
      // the timestamp is received from the server not from the firebase 
      // it needs to be converted to firebase timestamp
      Timestamp.fromMillis(data.created._seconds * 1000 + data.created._nanoseconds)
    )

    return user
  }

  static async getUser(user_id: string): Promise<User> {
    const data = await UserService.get(user_id)
    if (!data) 
      throw new Error ("Cannot get the User Document")

    const user = new User(
      data.id,
      data.name,
      data.description,
      data.photo,
      data.contacts,
      data.groups,
      data.created
    )    

    return user
  }

  static async getUserWithUID(uid: string): Promise<User> {
    const data = await UserService.getWithUID(uid)

    if (!data.exists())
      throw new Error("Document doesn't exists")

    const _data = data.data()
    const user = new User(
      data.id,
      _data.name,
      _data.description,
      _data.photo,
      _data.contacts,
      _data.groups,
      _data.created
    )

    return user
  }

  static async search(name: string): Promise<User[]> {
    const q = query(collection(db, 'users'), where('name', ">=", name), where('name', '<=', name + "~"))

    const snapshots = await getDocs(q)

    const users = []

    for (const doc of snapshots.docs) {
      const data: any = doc.data()
      users.push(new User(
        doc.id,
        data.name,
        data.description,
        data.photo,
        data.contacts,
        data.groups,
        data.created
      ))
    }

    return users
  }

  async update(data: { name?: string, photo?: File | string, description?: string }) {
    const user: any = await UserService.update(this.id, { ...data })

    this.name = user.name || this.name
    this.description = user.description || this.description
    this.photo = user.photo || this.photo
  }

  listenForChanges(cb: (snapshot: DocumentSnapshot<DocumentData>) => void): Unsubscribe {
    const unsub = UserService.listenForUserChanges(this.id, cb)
    return unsub
  }
}

export { UserService }
