import type { QuerySnapshot, DocumentData } from 'firebase/firestore'
import {
  query,
  collection,
  where,
  or,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/services/db'

export class InviteService {
  static async send(from: string, to: string) {
    const formdata = new FormData()
    formdata.append('from', from)
    formdata.append('to', to)

    const res = await fetch('/api/sendInvite', {
      method: 'POST',
      body: formdata,
    })

    if (res.status != 200)
      throw new Error(
        (await res.json()).error || 'ERROR in InviteService::Send::Method'
      )

    const json = await res.json()
    return json
  }

  static async accept(invite_id: string, user_id: string) {
    const formdata = new FormData()
    formdata.append('invite_id', invite_id)
    formdata.append('user_id', user_id)

    const res = await fetch('/api/acceptInvite', {
      method: 'POST',
      body: formdata,
    })

    if (res.status != 200)
      throw new Error(
        (await res.json()).error || 'ERROR in InviteService::Accept::Method'
      )

    const json = await res.json()

    if (json.result !== 'ok') throw new Error('Response is not ok')
  }

  static async groupSend(
    group_id: string,
    user_id: string,
    receiver_id: string
  ) {
    const formdata = new FormData()
    formdata.append('group_id', group_id)
    formdata.append('user_id', user_id)
    formdata.append('receiver_id', receiver_id)

    const res = await fetch('/api/group/sendInvite', {
      method: 'POST',
      body: formdata,
    })

    if (res.status != 200)
      throw new Error(
        (await res.json()).error || 'ERROR in InviteService::GroupSend::Method'
      )

    const json = await res.json()

    return json
  }

  static async groupAccept(invite_id: string, user_id: string) {
    const formdata = new FormData()
    formdata.append('invite_id', invite_id)
    formdata.append('user_id', user_id)

    const res = await fetch('/api/group/acceptInvite', {
      method: 'POST',
      body: formdata,
    })

    if (res.status != 200)
      throw new Error(
        (await res.json()).error ||
          'ERROR in InviteService::GroupAccept::Method'
      )

    const json = await res.json()

    return json
  }

  static async cancel(invite_id: string, user_id: string) {
    const formdata = new FormData()

    formdata.append('invite_id', invite_id)
    formdata.append('user_id', user_id)

    const res = await fetch('/api/cancelInvite', {
      method: 'POST',
      body: formdata,
    })

    if (res.status !== 200)
      throw new Error(
        (await res.json()).message ||
          'Error in GroupService::CancelInvite::Method'
      )

    const json = await res.json()

    if (json.result !== 'ok') throw new Error('Response result is not ok')
  }

  static async groupCancel(invite_id: string, user_id: string) {
    const formdata = new FormData()

    formdata.append('invite_id', invite_id)
    formdata.append('user_id', user_id)

    const res = await fetch('/api/group/cancel', {
      method: 'POST',
      body: formdata,
    })

    if (res.status !== 200) throw new Error('response status is not 200')
  }

  static listenForChanges(
    user_id: string,
    collection_name: string,
    cb: (snapshot: QuerySnapshot<DocumentData>) => void
  ): Unsubscribe {
    const collectionRef = collection(db, collection_name)
    const q = query(
      collectionRef,
      or(where('to', '==', user_id), where('from', '==', user_id))
    )

    const unsub = onSnapshot(q, cb)
    return unsub
  }
}
