'use client'

import getApp from '@/firebase'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import LoginForm from './form'
import Seperator from './seperator'
import SignInWithGoogle from './logInWithGoogle'
import DontHaveAccount from './dontHaveAccount'

export default function Login() {
  const handleEmailLogin = (email: string, password: string) => {
    if (email && password) {
      const app = getApp()
      const auth = getAuth(app)

      signInWithEmailAndPassword(auth, email, password)
        .then((credential) => {
          console.log('LOGIN CREDENTIAL', credential)
        })
        .catch(console.error)
    }
  }

  const googleLogin = () => {
    const app = getApp()
    const auth = getAuth(app)

    const provider = new GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')

    signInWithPopup(auth, provider)
      .then((credential) => {
        console.log('GOOGLE credential', credential)
      })
      .catch(console.error)
  }

  return (
    <div className="form-container flex flex-col gap-5 p-4">
      <LoginForm loginWithEmailPassword={handleEmailLogin} />
      <Seperator />
      <SignInWithGoogle handleClick={googleLogin} />
      <DontHaveAccount />
    </div>
  )
}
