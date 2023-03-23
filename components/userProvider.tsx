'use client'

import { Suspense } from 'react'
import Auth from '@/context/auth.context'
import { useGetUser } from '@/hooks/getUser'
import Header from '@/components/Header'
import Loader from './loader'

const Loading = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-32 h-32 relative">
        <Loader color="white" />
      </div>
    </div>
  )
}

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, setContact, setUser, changeUser } = useGetUser()
  
  return (
    <Auth.Provider value={{ user, setContact, setUser, changeUser }}>
      <Header/>
      <Suspense fallback={<Loading/>}>
        {children}
      </Suspense>
    </Auth.Provider>
  )
}