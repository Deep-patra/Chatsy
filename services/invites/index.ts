import {
  doc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
  Unsubscribe,
  Timestamp,
  type QuerySnapshot,
  type DocumentData,
} from 'firebase/firestore'
import { InviteService } from './service'
import { db } from '../db'
import type { InviteDisplayInfo, InviteInterface } from '../'

interface InviteReturn<T> {
  sent: T[]
  received: T[]
}

export class Invite implements InviteInterface {
  data: InviteDisplayInfo | null = null

  constructor(
    readonly id: string,
    readonly to: string,
    readonly from: string,
    readonly time: Timestamp
  ) {}

  static async getAll(user_id: string): Promise<InviteReturn<Invite>> {
    const result: InviteReturn<Invite> = { sent: [], received: [] }

    const received_q = query(
      collection(db, 'invites'),
      where('to', '==', user_id)
    )
    const receivedDocs = await getDocs(received_q)

    const sent_q = query(
      collection(db, 'invites'),
      where('from', '==', user_id)
    )
    const sentDocs = await getDocs(sent_q)

    receivedDocs.forEach((snapshot) => {
      let data = snapshot.data()

      result.received.push(
        new Invite(snapshot.id, data.to, data.from, data.time)
      )
    })

    sentDocs.forEach((snapshot) => {
      let data = snapshot.data()

      result.sent.push(new Invite(snapshot.id, data.to, data.from, data.time))
    })

    return result
  }

  async getDisplayInfo(user_id: string): Promise<InviteDisplayInfo> {
    if (this.data) return this.data

    let id: string = this.to
    if (this.to === user_id) id = this.from

    const ref = doc(collection(db, 'users'), id)
    const userDoc = await getDoc(ref)

    this.data = {
      name: userDoc.get('name'),
      photo: userDoc.get('photo'),
      time: this.time,
    }

    return this.data
  }

  async accept(user_id: string) {
    await InviteService.accept(this.id, user_id)
  }

  async cancel(user_id: string) {
    await InviteService.cancel(this.id, user_id)
  }

  static listenForUserInvites(
    user_id: string,
    cb: (snapshot: QuerySnapshot<DocumentData>) => void
  ): Unsubscribe {
    const unsub = InviteService.listenForChanges('invites', user_id, cb)
    return unsub
  }
}

export class GroupInvite implements InviteInterface {
  data: InviteDisplayInfo | null = null

  constructor(
    readonly id: string,
    readonly group_id: string,
    readonly to: string,
    readonly from: string,
    readonly time: Timestamp
  ) {}

  static async getAll(user_id: string): Promise<InviteReturn<GroupInvite>> {
    const result: InviteReturn<GroupInvite> = { sent: [], received: [] }

    const received_q = query(
      collection(db, 'groupInvites'),
      where('to', '==', user_id)
    )
    const receivedDocs = await getDocs(received_q)

    const sent_q = query(
      collection(db, 'groupInvites'),
      where('from', '==', user_id)
    )
    const sentDocs = await getDocs(sent_q)

    receivedDocs.forEach((snapshot) => {
      let data = snapshot.data()

      result.received.push(
        new GroupInvite(
          snapshot.id,
          data.group_id,
          data.to,
          data.from,
          data.time
        )
      )
    })

    sentDocs.forEach((snapshot) => {
      let data = snapshot.data()

      result.sent.push(
        new GroupInvite(
          snapshot.id,
          data.group_id,
          data.to,
          data.from,
          data.time
        )
      )
    })

    return result
  }

  async getDisplayInfo(user_id: string): Promise<InviteDisplayInfo> {
    if (this.data) return this.data

    const ref = doc(collection(db, 'groups'), this.group_id)
    const groupDoc = await getDoc(ref)

    this.data = {
      name: groupDoc.get('name'),
      photo: groupDoc.get('photo'),
      time: this.time,
    }

    return this.data
  }

  async accept(user_id: string) {
    await InviteService.groupAccept(this.id, user_id)
  }

  async cancel(user_id: string) {
    await InviteService.groupCancel(this.id, user_id)
  }

  static listenForGroupInvites(
    user_id: string,
    cb: (snapshot: QuerySnapshot<DocumentData>) => void
  ): Unsubscribe {
    const unsub = InviteService.listenForChanges('groupInvites', user_id, cb)
    return unsub
  }
}
