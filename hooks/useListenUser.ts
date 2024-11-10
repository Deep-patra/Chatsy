import { useEffect } from 'react'
import {
  type DocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore'
import { User, UserService } from '@/services/user'
import log from '@/components/utils/log'


export const useListenUser = (user: User | null, setUser: (user: User) => void) => {
  const callback = (snapshot: DocumentSnapshot<DocumentData>) => {
    const data = snapshot.data()

    log("Snapshot in 'useListenUser'", data)

    if (!data)
      return

    const new_user = new User(
      snapshot.id,
      data.name,
      data.description,
      data.photo,
      data.contactIds,
      data.groupIds,
      data.created
    )

    setUser(new_user)
  }

  useEffect(() => {
    let unsub = () => {}
    
    if (user)
      unsub = UserService.listenForUserChanges(user.id, callback)

    return () => { unsub() }
  }, [user ? user.id : null])
}
