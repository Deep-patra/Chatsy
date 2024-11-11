import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getApp } from '@/firebase'
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import type { User as AuthUser } from 'firebase/auth'
import { User } from '@/services/user'
import { type IUserContext } from '@/context/user.context'
import log from '@/components/utils/log'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'

const getUser = async (user: AuthUser | null) => {
  if (!user) throw new Error('User is Null')

  const { displayName, photoURL, uid, email } = user

  let userDoc = await User.getUserWithUID(uid).catch(console.error)

  if (userDoc) return userDoc

  return null
}

const createUser = async (user: AuthUser | null) => {
  if (!user) throw new Error('auth user is null')

  const { uid, displayName, photoURL, email } = user

  if (!email) throw new Error('email is not present')

  const doc = await User.create(uid, email, displayName ?? undefined)

  if (!doc) throw new Error('cannot create user document')

  return doc
}

export const useGetUser = (): IUserContext => {
  const [_user, changeUser] = useState<User | null>(null)
  const router = useRouter()

  const setUser = (user: User) => {
    changeUser(user)
  }

  const authStateChanged = () => {
    const app = getApp()
    const auth = getAuth(app)

    const unsub = onAuthStateChanged(
      auth,

      async (user) => {
        // if the auth user is not present
        // return
        if (!user) return

        const doc = await getUser(user).catch(console.error)

        // if the user is present
        // set the user
        // go to the home page
        if (doc) {
          setUser(doc)

          // if the user name is not present
          // route to getDetails page
          if (!doc.name || doc.name == '') router.push('/getDetails')
          else router.push('/home')

          return
        }

        const userDoc = await createUser(user).catch(console.error)

        // if user cannot be created
        // route to error page
        if (!userDoc) {
          router.push('/error')
          return
        }

        // set the user
        // route to getDetails page
        setUser(userDoc)
        router.push('/getDetails')

        return
      },

      (error) => {
        console.error('Error in Auth', error)
      },

      () => {
        log('COMPLETED')
      }
    )

    return unsub
  }

  useEffect(() => {
    const unsub = authStateChanged()
    return unsub
  }, [])

  return { user: _user, setUser }
}
