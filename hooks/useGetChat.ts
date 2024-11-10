import { useState } from 'react'
import { ChatInterface } from '@/services'
import { type IChatContext } from '@/context/chat.context'

export const useGetChat = (): IChatContext => {
  const [chat, changeChat] = useState<ChatInterface | null>(null)

  const changeActiveChat = (new_chat: ChatInterface | null) => {
    changeChat(new_chat)
  }

  return {
    activeChat: chat,
    changeActiveChat
  }
}
