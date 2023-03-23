import { useState } from 'react'
import { type IChat, type IMessage } from '@/context/chat.context'

type UseGetChatsReturn = [IChat[], (contactId: string, message: IMessage[]) => void, (chats: IChat[]) => void]


function addMessage(messages: IMessage[], message: IMessage): IMessage[] {

  if (messages.length === 0) return [message]

  const firstMessage = messages[0]
  const lastMessage = messages[messages.length - 1]

  if (message.time.getTime() < firstMessage.time.getTime()) messages.unshift(message)
  else if (message.time.getTime() > lastMessage.time.getTime()) messages.push(message)
  else {
    for (let idx = 0; idx < messages.length - 1; idx ++) {
      if (messages[idx].time.getTime() > message.time.getTime() && messages[idx + 1].time.getTime() < message.time.getTime())
        return messages.splice(idx + 1, 0, message)
    }
  } 

  return messages
}


const useGetChats = (): UseGetChatsReturn => {
  const [chats, changeChats] = useState<IChat[]>([])

  const _changeChats = (_chats: IChat[]) => { changeChats(_chats) }

  const updateChats = (contactId: string, messages: IMessage[]) => {
    const updatedChats = chats

    const found = chats.find((value) => value.userId === contactId)

    if (!found) {
      updatedChats.push({ userId: contactId, messages })
      return
    }

    updatedChats.forEach((value: IChat) => {
      if (value.userId === contactId) {
        messages.forEach((message) => { value.messages = [...addMessage(value.messages, message)] })
      }
    })

    changeChats([ ...updatedChats ])
    return
  }

  return [chats, updateChats, _changeChats]
}

export { useGetChats }