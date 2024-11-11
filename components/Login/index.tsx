'use client'

import { useCallback, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { getApp } from '@/firebase'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import * as Auth from 'firebase/auth'
import LoginForm from './form'
import Seperator from './seperator'
import SignInWithGoogle from './logInWithGoogle'
import DontHaveAccount from './dontHaveAccount'
import { User } from '@/services/user'
import UserContext from '@/context/user.context'
import log from '@/components/utils/log'

export default function Login() {
  const { setUser } = useContext(UserContext)

  const router = useRouter()

  const getUser = useCallback(async (user: Auth.User) => {
    const doc = await User.getUserWithUID(user.uid)
        .catch(console.error)

    return doc
  }, [])

  const handleEmailLogin = useCallback((email: string, password: string) => {
    if (email && password) {
      const app = getApp()
      const auth = getAuth(app)

      signInWithEmailAndPassword(auth, email, password)
        .then(async (credential) => {
          log('LOGIN CREDENTIAL', credential)

          const { user } = credential

          const doc = await getUser(user)

          // if the user document doesnot exists
          // redirect to "/userDoesNotExists"
          if (!doc) {
            router.push('/userDoesNotExsits')
            return
          }

          setUser(doc)

          // if user name is not present
          // redirect to "getDetails" page
          if (!doc.name || doc.name === "") {
            router.push('/getDetails')
            return
          }

          router.push('/home')
        })
        .catch(console.error)
    }
  }, [router])

  const googleLogin = useCallback(() => {
    const app = getApp()
    const auth = getAuth(app)

    const provider = new GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')

    signInWithPopup(auth, provider)
      .then(async (credential) => {
        log('GOOGLE credential', credential)

        const { user } = credential

        const doc = await getUser(user)

        if (!doc) {
          router.push('userDoesNotExists')
          return
        }
          
        setUser(doc)

        // if user name is not present
        // redirect to "getDetails" page
        if (!doc.name || doc.name === "") {
          router.push('/getDetails')
          return
        }

        router.push('/home')
        
      })
      .catch(console.error)
  }, [])

  return (
    <div
      data-testid="login-form-container"
      className="form-container flex flex-col gap-5 p-4 | md:w-[400px] md:bg-black1 md:p-3 md:p-8 rounded-md"
    >
      <LoginForm loginWithEmailPassword={handleEmailLogin} />
      <Seperator />
      <SignInWithGoogle handleClick={googleLogin} />
      <DontHaveAccount />
    </div>
  )
}
