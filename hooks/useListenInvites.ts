import { useContext, useEffect } from 'react'
import type {
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore'
import UserContext from '@/context/user.context'
import InviteContext from '@/context/invites.context'
import { Invite, GroupInvite } from '@/services/invites'


type cb = (snapshot: QuerySnapshot<DocumentData>) => void

const getCallback = (
  user_id: string,
  refreshInvites: (user_id: string) => void
): cb => {
  return (snapshot: QuerySnapshot<DocumentData>) => {
    const changes = snapshot.docChanges()

    changes.forEach((change) => {

      if (change.type == "removed")
        refreshInvites(user_id)

      if (change.type == "added")
        refreshInvites(user_id)
    })
  }
}


export const useListenInvites = () => {
  const { user } = useContext(UserContext)
  const { refreshInvites } = useContext(InviteContext)

  useEffect(() => {
    let unsubUser = () => {}
    let unsubGroup = () => {}

    if (user) {
      unsubUser = Invite.listenForUserInvites(user.id, getCallback(user.id,  refreshInvites))
      unsubGroup = GroupInvite.listenForGroupInvites(user.id, getCallback(user.id,  refreshInvites))
    }

    return () => {
      // unsubsribe from all the listener
      unsubUser()
      unsubGroup()
    }
  }, [user])
}
