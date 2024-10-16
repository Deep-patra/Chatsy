'use client'

import { useEffect } from 'react'
import Auth from '@/context/auth.context'
import Home from '@/components/Home'

export default function Page() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
  }, [])
  return (
    <>
      <Auth.Consumer>
        {({ user }) => <>
          {user && <Home/>}
        </>}
      </Auth.Consumer>
    </>
  )
}
