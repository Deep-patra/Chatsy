import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getApp } from '@/firebase'
import { onAuthStateChanged, getAuth, User, connectAuthEmulator } from 'firebase/auth'
import UserService from '@/services/user.service'
import { type IUser, type IContact } from '@/context/auth.context'

interface IUseGetUserReturn {
  user: IUser | null
  setUser: (user: User) => void
  setContact: (contact: IContact[]) => void
  changeUser: (user: IUser) => void
}

const useGetUser = (): IUseGetUserReturn => {
  const [user, _changeUser] = useState<IUser | null>(null)
  const router = useRouter()

  const getUserDoc = async (user: User): Promise<IUser | null> => {
    const { displayName, photoURL, uid, email } = user
    let name = displayName
    if (!name) name = email ? email?.split('@')[0] || '' : 'Unknown'

    const userDoc = await UserService.create({
      displayName: name,
      uuid: uid,
      email: email || '',
      photoURL: photoURL || '',
    })

    if (!userDoc) return null

    return {
      uid,
      name: userDoc.name,
      email: userDoc.email,
      photoURL: userDoc.photoURL,
      contacts: userDoc.contacts,
    }
  }

  const changeUser = (user: IUser) => {
    _changeUser(user)
  }

  const setUser = (user: User | null) => {
    if (!user) {
      _changeUser(null)
      return
    }

    getUserDoc(user).then((value: IUser | null) => {
      _changeUser(value)
    })
  }

  const setContact = (contacts: IContact[]) => {
    _changeUser({ ...user, contacts } as any)
  }

  const authStateChanged = () => {
    const app = getApp()
    const auth = getAuth(app)

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user)

        if (user) router.push('/home')
      },
      (error) => {
        console.error('ERROR IN AUTH', error)
      },
      () => {
        console.log('COMPLETED')
      }
    )

    return unsubscribe
  }

  useEffect(() => {
    const unsubscribe = authStateChanged()

    return () => {
      unsubscribe() // unsubscribe from the observer
    }
  }, [])

  return { user, setUser, setContact, changeUser }
}

export { useGetUser }
