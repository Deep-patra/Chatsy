'use client'

import { useEffect } from 'react'

export default function RegisterSW() {
  const register = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })

        // Installing
        if (registration.installing)
          console.info('[Service Worker] installing...')
        // Waiting
        else if (registration.waiting)
          console.info('[Service Worker] waiting...')
        // Active
        else if (registration.active) console.info('[Service Worker] Active.')

        // Error
      } catch (error) {
        console.error('[Service Worker] Registration Failed with ${error}')
      }
    }
  }

  // Register the service worker
  useEffect(() => {
    register()
  }, [])

  return <></>
}
