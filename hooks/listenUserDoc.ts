import { useState, useEffect, useContext } from 'react'
import { type DocumentSnapshot, type DocumentData } from 'firebase/firestore'
import Auth, { type IUser, type IContact } from '@/context/auth.context'
import UserService from '@/services/user.service'
import ContactService from '@/services/contact.service'

const useListenUser = () => {
  const { user, setContact, changeUser } = useContext(Auth)

  useEffect(() => {
    const handleChanges = (snapshot: DocumentSnapshot<DocumentData>) => {
      const data = snapshot.data()

      if (data) {
        user &&
          changeUser({ ...user, name: data.name, photoURL: data.photoURL })

        // get the contacts whenever the user changes
        user &&
          ContactService.getAll(user?.uid).then((contacts) => {
            setContact(contacts as any)
          })
      }
    }

    let unsubscribe = () => {}

    if (user) {
      unsubscribe = UserService.listenForChanges(user.uid, handleChanges)
    }

    return () => {
      unsubscribe()
    }
  }, [])
}

export { useListenUser }
