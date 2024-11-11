'use client'

import { Suspense } from 'react'
import User from '@/context/user.context'
import Contact from '@/context/contact.context'
import Group from '@/context/group.context'
import Invite from '@/context/invites.context'
import Chat from '@/context/chat.context'
import Header from '@/components/Header'
import Loader from './loader'
import { useGetUser } from '@/hooks/useGetUser'
import { useGetContacts } from '@/hooks/useGetContacts'
import { useGetGroups } from '@/hooks/useGetGroups'
import { useGetInvites } from '@/hooks/useGetInvites'
import { useGetChat } from '@/hooks/useGetChat'

const Loading = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-32 h-32 relative">
        <Loader color="white" />
      </div>
    </div>
  )
}

export default function UserProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, setUser } = useGetUser()
  const { groups, setGroups, updateGroup } = useGetGroups()
  const { contacts, setContacts, updateContact } = useGetContacts()
  const { invites, setInvites, refreshInvites } = useGetInvites()
  const { activeChat, changeActiveChat } = useGetChat()

  return (
    <User.Provider value={{ user, setUser }}>
      <Contact.Provider value={{ contacts, setContacts, updateContact }}>
        <Group.Provider value={{ groups, setGroups, updateGroup }}>
          <Invite.Provider value={{ invites, setInvites, refreshInvites }}>
            <Chat.Provider value={{ activeChat, changeActiveChat }}>
              <>
                <Header />
                <Suspense fallback={<Loading />}>{children}</Suspense>
              </>
            </Chat.Provider>
          </Invite.Provider>
        </Group.Provider>
      </Contact.Provider>
    </User.Provider>
  )
}
