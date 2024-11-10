import { createContext } from 'react'
import type { ChatInterface } from '@/services'

export interface IChatContext {
  activeChat: ChatInterface | null
  changeActiveChat: (chat: ChatInterface | null) => void
}

const ChatContext = createContext<IChatContext>({
  activeChat: null,
  changeActiveChat: (chat: ChatInterface | null) => {},
})

export default ChatContext
