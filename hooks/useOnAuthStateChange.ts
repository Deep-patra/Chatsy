import { useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import { getApp } from '@/firebase'
import { User } from '@/services/user'
import log from '@/components/utils/log'
import UserContext from '@/context/user.context'

export const useOnAuthStateChanges = () => {

  const { user, setUser } = useContext(UserContext)
  const router = useRouter()

  useEffect(() => {

    const app = getApp()
    const auth = getAuth(app)

    const unsub = onAuthStateChanged(
      auth,
      // on success
      async (auth_user) => {

        // if context user is not present
        // and auth user is also not present
        // redirect to '/login' page
        if (!user && !auth_user) {
          router.push('/login')
          return
        }

        if (!auth_user)
          return

        log("Received user in onAuthStateChanged", auth_user)

        const doc = await User.getUserWithUID(auth_user.uid)
              .catch(console.error)

        // if the user document doesn't exists
        // redirect to "/login"
        if (!doc) {
          router.push('/login')
          return
        }

        setUser(doc)
      },

      // on error
      (error) => {
        console.error(error)
      },

      // on completion
      () => {}
    )

    return unsub
  }, [])
}
