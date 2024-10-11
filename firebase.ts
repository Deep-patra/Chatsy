import { type FirebaseApp, initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyAYv_8l_eGQaSS-vb9_SQO9eKJXRMhAEEw',
  authDomain: 'chatsy-456.firebaseapp.com',
  projectId: 'chatsy-456',
  storageBucket: 'chatsy-456.appspot.com',
  messagingSenderId: '816847956610',
  appId: '1:816847956610:web:c7cd57381515bbdb42229b',
  measurementId: 'G-XHXX67MTB8',
}

let app: FirebaseApp | null = null

export const getApp = () => {
  if (app) return app

  app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true })
  return app
}

export const initialzeAnalytics = (app: FirebaseApp) => {
  return getAnalytics(app)
}

export const useEmulators = () => {
  if (process.env.NEXT_PUBLIC_NODE_ENV == 'development') return true

  return false
}
