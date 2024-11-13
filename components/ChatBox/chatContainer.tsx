import { useRef, useContext, useEffect, useState, memo } from 'react'
import UserContext from '@/context/user.context'
import ChatContext from '@/context/chat.context'
import Message from './message'
import Loader from '@/components/loader'
import NoActiveUser from './noActiveUser'
import NoMessage from './noMessage'
import { IMessage } from '@/services'
import { useListenMessages } from '@/hooks/useListenMessages'

const LoadingMessages = memo(function loadingMessages() {
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
})

export default function ChatContainer() {
  const { user } = useContext(UserContext)
  const { activeChat } = useContext(ChatContext)

  const [messages, changeMessages] = useState<IMessage[]>([])

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

  useListenMessages(activeChat, (m: IMessage[]) => changeMessages(m))

  // useEffect(() => {
  //   if (activeChat)
  //     activeChat
  //       .getMessages({ limit: 10 })
  //       .then((results) => {
  //         if (results) changeMessages(results)
  //       })
  //       .catch(console.error)
  // }, [activeChat, changeMessages])

  if (!user) return <></>

  if (!activeChat) return <NoActiveUser />

  return (
    <main
      ref={containerRef}
      style={{ gridRowStart: 2, gridRowEnd: 3 }}
      className="flex flex-col justify-end w-full h-full"
    >
      <div
        ref={topRef}
        style={{ height: '5px' }}
        className="w-full flex-shrink-0"
      ></div>
      <ul className="decorate-scrollbar | flex flex-col | w-full min-h-0 max-h-full | overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((message, idx) => (
            <Message
              key={message.id}
              user={user}
              activeChat={activeChat}
              message={message}
            />
          ))
        ) : (
          <NoMessage />
        )}
      </ul>
    </main>
  )
}
