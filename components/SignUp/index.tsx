'use client'

import { getApp } from '@/firebase'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import SignupForm from './form'
import Seperator from './seperator'
import SignInWithGoogle from './signInWithGoogle'
import AlreadyHaveAccount from './alreadyHaveAccont'
import log from '@/components/utils/log'

export default function SignUp() {
  const handleEmailSignIn = (email: string, password: string) => {
    const app = getApp()
    const auth = getAuth(app)

    createUserWithEmailAndPassword(auth, email, password)
      .then((credential) => {
        log('CREDENTIAL from EMAIL and PASSWORD', credential)
      })
      .catch(console.error)
  }

  const handleGoogleSignIn = () => {
    const app = getApp()
    const auth = getAuth(app)

    const provider = new GoogleAuthProvider()
    provider.addScope('email')
    provider.addScope('profile')

    signInWithPopup(auth, provider)
      .then((credential) => {
        log('CREDENTIAL RECEIVED:', credential)
      })
      .catch(console.error)
  }

  return (
    <div className="form-container flex flex-col items-center gap-5 | md:w-[400px] md:bg-black1 md:p-3 md:p-8 rounded-md">
      <SignupForm signUpWithEmailPassword={handleEmailSignIn} />
      <Seperator />
      <SignInWithGoogle handleClick={handleGoogleSignIn} />
      <AlreadyHaveAccount />
    </div>
  )
}
