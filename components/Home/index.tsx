'use client'

import { useContext } from 'react'
import Sidebar from '../Sidebar'
import MiddleBar from '../MiddleBar'
import ChatBox from '../ChatBox'
import InfoBar from '../Infobar'
import Modals from './modals'
import Snackbar from '@/components/snackbar'
import UserContext from '@/context/user.context'
import { useListenUser } from '@/hooks/useListenUser'
import { useListenInvites } from '@/hooks/useListenInvites'
import { useRegisterSW } from '@/hooks/useRegisterSW'
import { useOnAuthStateChanges } from '@/hooks/useOnAuthStateChange'

export default function Home() {
  const { user, setUser } = useContext(UserContext)

  // listen for the user document changes
  useListenUser(user, setUser)

  // listen for invite
  useListenInvites()

  // Register service worker and enable code syntax hightlighting
  useRegisterSW()

  // onAuthStateChanges
  useOnAuthStateChanges()

  return (
    <>
      {user && (
        <div className="relative flex flex-row gap-1">
          <Sidebar />

          <MiddleBar />

          {/* Chat box */}
          <ChatBox />

          {/* Info bar when the chat is opened */}
          <InfoBar />

          {/* Modals */}
          <Modals />

          {/** Snackbar **/}
          <Snackbar />
        </div>
      )}
    </>
  )
}
