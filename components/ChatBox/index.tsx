import { useState, useContext, useEffect } from 'react'
import ChatContext from '@/context/chat.context'
import ChatContainer from './chatContainer'
import MessageInputBox from './messageInputBox'
import TopBar from './topbar'
import ChatBot from '@/components/Chatbot'
import { events } from '../utils/events'
import log from '../utils/log'

export default function Chatbox() {
  const { activeChat, changeActiveChat } = useContext(ChatContext)

  const [showChatbot, changeShowChatbot] = useState<boolean>(false)
  const [loading, changeLoading] = useState<boolean>(false)

  useEffect(() => {
    if (activeChat) {
      log(activeChat)

      // close the chat bot, if opened
      changeShowChatbot(false)
    }
  }, [activeChat])

  useEffect(() => {
    const handler = () => {
      changeActiveChat(null)
      changeShowChatbot(true)
    }

    document.body.addEventListener(events.open_chatbot, handler)

    return () => {
      document.removeEventListener(events.open_chatbot, handler)
    }
  }, [])

  return (
    <div className="chatbox | relative z-0 | p-1 rounded-md w-full max-h-full | overflow-hidden">
      {activeChat && (
        <>
          <TopBar />

          {!loading && <ChatContainer />}

          <MessageInputBox {...{ activeChat }} />
        </>
      )}

      {showChatbot && <ChatBot />}
    </div>
  )
}
