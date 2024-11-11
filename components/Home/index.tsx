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
import { useRedirectIfUserIsNull } from '@/hooks/useRedirectIfUserIsNull'

export default function Home() {
  const { user, setUser } = useContext(UserContext)

  // listen for the user document changes
  useListenUser(user, setUser)

  // listen for invite
  useListenInvites()

  // Redirect the user, if its null
  useRedirectIfUserIsNull(user, '/login')

  return (
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
  )
}
