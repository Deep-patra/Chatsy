'use client'
import { useContext, useState, useEffect } from 'react'
import Sidebar from '../Sidebar'
import Contact from './contacts'
import ChatBox from '../ChatBox'
import Search from '../Search'
import Setting from '../Setting'
import Profile from '../Profile'
import Logout from '../logout'
import Auth, { IContact } from '@/context/auth.context'
import Chat, { type IChat, type IMessage } from '@/context/chat.context'
import { useGetChats } from '@/hooks/getChats'
import { useListenUser } from '@/hooks/listenUserDoc'

export default function Home() {
  const [contacts, changeContacts] = useState<IContact[]>([])
  const [openedContacts, changeOpenedContacts] = useState<IContact[]>([])
  const [activeContact, _changeActiveContact] = useState<IContact | null>(null)

  const { user } = useContext(Auth)
  const [chats, updateChats, changeChats] = useGetChats()

  // listen to user document changes
  useListenUser()

  const handleOpenChat = (uid: string) => {
    const selectedContact = contacts.find((value) => value.uid === uid)

    if (selectedContact) {
      if (!openedContacts.find((value) => value.uid === uid))
        changeOpenedContacts([...openedContacts, selectedContact])

      _changeActiveContact(selectedContact)
    }
  }

  const changeActiveContact = (contact: IContact | null) => {
    _changeActiveContact(contact)
  }

  useEffect(() => {
    user && changeContacts(user.contacts)
  }, [user])

  return (
    <Chat.Provider value={{ chats, updateChats, changeChats }}>
      <div className="relative flex flex-row">
        <Sidebar>
          <div className="overflow-y-auto">
            <Contact contacts={contacts} handleOpenChat={handleOpenChat} />
          </div>
        </Sidebar>

        <ChatBox
          activeContact={activeContact}
          openedContacts={openedContacts}
          changeOpenedContacts={changeOpenedContacts}
          changeActiveContact={changeActiveContact}
        />

        {/* Search Modal */}
        <Search />

        {/* Setting Modal */}
        <Setting />

        {/* Profile Modal */}
        <Profile />

        {/* Logout Modal */}
        <Logout />
      </div>
    </Chat.Provider>
  )
}
