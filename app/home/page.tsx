'use client'

import { useEffect, useContext } from 'react'
import hljs from 'highlight.js'
import Auth from '@/context/auth.context'
import Home from '@/components/Home'

export default function Page() {
  const user = useContext(Auth)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }

    hljs.highlightAll()
  }, [])
  return <>{user && <Home />}</>
}
