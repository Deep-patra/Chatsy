'use client'

import { useContext, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getApp } from '@/firebase'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import * as Auth from 'firebase/auth'
import SignupForm from './form'
import Seperator from './seperator'
import SignInWithGoogle from './signInWithGoogle'
import AlreadyHaveAccount from './alreadyHaveAccont'
import { User } from '@/services/user'
import UserContext from '@/context/user.context'
import { dispatchSnackbarEvent } from '../utils/dispatchEvent'
import log from '@/components/utils/log'

export default function SignUp() {
  const { setUser } = useContext(UserContext)

  const router = useRouter()

  const redirectIfUserExists = useCallback(
    async (user: Auth.User) => {
      const userDoc = await User.getUserWithUID(user.uid).catch(console.error)

      // if the user document is present,
      // redirect to "/userAlreadyExists"
      if (userDoc) router.push('/userAlreadyExists')
    },
    [router]
  )

  const createUser = useCallback(async (user: Auth.User) => {
    if (!user.email) return

    const userDoc = await User.create(
      user.uid,
      user?.email,
      user.displayName ?? undefined
    ).catch(console.error)

    if (!userDoc) {
      dispatchSnackbarEvent({ type: 'error', text: 'cannot sign up' })
      return
    }

    return userDoc
  }, [])

  const handleEmailSignIn = useCallback((email: string, password: string) => {
    const app = getApp()
    const auth = getAuth(app)

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (credential) => {
        log('CREDENTIAL from EMAIL and PASSWORD', credential)
      
        const { user } = credential

        // redirect if the user document exsits
        await redirectIfUserExists(user)

        const doc = await createUser(user)

        if (!doc) return

        // set the user and redirect to the "/getDetails" page
        setUser(doc)

        router.push('/getDetails')
      })
      .catch(console.error)
  }, [])

  const handleGoogleSignIn = useCallback(() => {
    const app = getApp()
    const auth = getAuth(app)

    const provider = new GoogleAuthProvider()
    provider.addScope('email')
    provider.addScope('profile')

    signInWithPopup(auth, provider)
      .then(async (credential) => {
        log('CREDENTIAL RECEIVED:', credential)

        const { user } = credential

        // redirect if the user document exsits
        await redirectIfUserExists(user)

        const doc = await createUser(user)

        if (!doc) return

        // set the user and redirect to the "/getDetails" page
        setUser(doc)

        router.push('/getDetails')
      })
      .catch(console.error)
  }, [])

  return (
    <div className="form-container flex flex-col items-center gap-5 | md:w-[400px] md:bg-black1 md:p-3 md:p-8 rounded-md">
      <SignupForm signUpWithEmailPassword={handleEmailSignIn} />
      <Seperator />
      <SignInWithGoogle handleClick={handleGoogleSignIn} />
      <AlreadyHaveAccount />
    </div>
  )
}
