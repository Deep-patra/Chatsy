'use client'

import getApp from '@/firebase'
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

export default function SignUp() {
  const handleEmailSignIn = (email: string, password: string) => {
    const app = getApp()
    const auth = getAuth(app)

    createUserWithEmailAndPassword(auth, email, password)
      .then((credential) => {
        console.log('CREDENTIAL from EMAIL and PASSWORD', credential)
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
        console.log('CREDENTIAL RECEIVED:', credential)
      })
      .catch(console.error)
  }

  return (
    <div className="form-container flex flex-col items-center gap-5">
      <SignupForm signUpWithEmailPassword={handleEmailSignIn} />
      <Seperator />
      <SignInWithGoogle handleClick={handleGoogleSignIn} />
      <AlreadyHaveAccount />
    </div>
  )
}
