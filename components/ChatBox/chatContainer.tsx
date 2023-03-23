import { useRef, useContext, useEffect, useState } from 'react'
import Auth from '@/context/auth.context'
import { IChat } from '@/context/chat.context'
import { IContact } from '@/context/auth.context'
import ChatService from '@/services/chat.service'
import { useListenChats } from '@/hooks/listenChat'
import Message from './message'
import Loader from '@/components/loader'

interface IChatContainerProps {
  openedContacts: IContact[]
  activeContact: IContact | null
  chats: IChat[]
  updateChats: any
  changeChats: any
}

interface IMessagesProps {
  activeContact: IContact
  chats: IChat[]
  scrollToBottom: () => void
}

function NoMessage() {
  return (
    <div className="w-full h-full flex flex-row items-center justify-center">
      <p className="text-white2">Start a conversation by saying Hi 👋.</p>
    </div>
  )
}

function NoActiveuser() {
  return (
    <div className="w-full h-full flex flex-row items-center justify-center">
      <p className="text-white2">Select a user to start a coversation.</p>
    </div>
  )
}

function LoadingMessages() {
  return (
    <div className="w-full flex flex-row items-center justify-center">
      <div className="w-6 h-6 relatve">
        <Loader color="white" />
      </div>
      <div>
        <span className="text-white2 text-xs md:text-sm">
          fetching older messages
        </span>
      </div>
    </div>
  )
}

function Messages(props: IMessagesProps) {
  const { chats, activeContact, scrollToBottom } = props
  let chat = chats.find((value) => value.userId === activeContact.uid)

  if (!chat) chat = { userId: activeContact.uid, messages: [] }

  const { user } = useContext(Auth)

  useEffect(() => {
    if (chat && chat.messages.length > 0) scrollToBottom()
  }, [chat.messages])

  return (
    <>
      {chat && chat.messages.length > 0 ? (
        chat.messages.map((message, idx) => (
          <Message
            key={idx}
            message={message}
            author={message.authorId === user?.uid ? user : activeContact}
            self={message.authorId === user?.uid}
          />
        ))
      ) : (
        <NoMessage />
      )}
    </>
  )
}

export default function ChatContainer(props: IChatContainerProps) {
  const { activeContact, updateChats, chats, changeChats } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (containerRef.current) {
      const element = containerRef.current

      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth',
      })
    }
  }

  // Listen to the new messages
  useListenChats(activeContact, updateChats, chats, changeChats)

  if (!activeContact) return <NoActiveuser />

  return (
    <div
      ref={containerRef}
      style={{ gridRowStart: 2, gridRowEnd: 3 }}
      className="flex flex-col w-full h-full overflow-y-auto"
    >
      <div
        ref={topRef}
        style={{ height: '5px' }}
        className="w-full flex-shrink-0"
      ></div>
      <Messages {...{ chats, activeContact, scrollToBottom }} />
    </div>
  )
}
