import { useEffect } from 'react'
import ChatService, { type callback } from '@/services/chat.service'
import { IMessage, IChat } from '@/context/chat.context'
import { IContact } from '@/context/auth.context'

type UpdateChat = (contactId: string, messages: IMessage[]) => void

const useListenChats = (
  activeContact: IContact | null,
  updateChat: UpdateChat,
  chats: IChat[],
  changeChats: (chats: IChat[]) => void
) => {
  const messageGroupId = activeContact ? activeContact.messageGroupId : null

  // reset the messages
  const resetChats = (activeContact: IContact | null) => {
    if (activeContact) {
      chats.forEach((value) => {
        if (value.userId === activeContact.uid) value.messages = []
      })

      changeChats([...chats])
    }
  }

  useEffect(() => {
    resetChats(activeContact)

    const listenerCallback: callback = (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data()
          const message: IMessage = {
            time: data.time ? data.time.toDate() : new Date(),
            text: data.text || '',
            images: data.images || [],
            authorId: data.authorId,
          }

          activeContact && updateChat(activeContact.uid, [message])
        }
      })
    }

    let unsubscribe = () => {}

    if (messageGroupId)
      unsubscribe = ChatService.listenForMessages(
        messageGroupId,
        listenerCallback
      )

    return () => {
      unsubscribe()
    }
  }, [messageGroupId, activeContact])
}

export { useListenChats }
