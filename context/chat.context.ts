import { createContext } from 'react'

export interface IMessage {
  text: string
  images: string[]
  time: Date
  authorId: string
}

export interface IChat {
  userId: string
  messages: IMessage[]
}

interface IChatContext {
  chats: IChat[]
  changeChats: (chats: IChat[]) => void
  updateChats: (contactId: string, message: IMessage[]) => void
}

const ChatContext = createContext<IChatContext>({
  chats: [],
  changeChats(chats: IChat[]) {},
  updateChats(contactId: string, message: IMessage[]) {},
})

export default ChatContext
