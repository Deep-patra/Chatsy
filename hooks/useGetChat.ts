import { useState, useEffect } from 'react'
import { ChatInterface } from '@/services'
import { Contact } from '@/services/contact'
import { Group } from '@/services/group'
import { type IChatContext } from '@/context/chat.context'
import type { DocumentSnapshot, DocumentData } from 'firebase/firestore'
import log from '@/components/utils/log'

export const useGetChat = (): IChatContext => {
  const [chat, changeChat] = useState<ChatInterface | null>(null)

  const changeActiveChat = (new_chat: ChatInterface | null) => {
    changeChat(new_chat)
  }

  useEffect(() => {
    const activeChatChanges = (activeChat: ChatInterface | null) => {
      if (activeChat) {
        const unsub = activeChat.listenForChanges(
          async (snapshot: DocumentSnapshot<DocumentData>) => {
            log('snapshot in activeChatChanges => ', snapshot)

            if (activeChat instanceof Contact) {
              const new_chat = new Contact(snapshot.id, {
                name: snapshot.get('name'),
                chatroom_id: activeChat.chatroom_id,
                description: snapshot.get('description'),
                created: snapshot.get('created'),
                photo: snapshot.get('photo'),
              })

              new_chat.messages = activeChat.messages
              new_chat.chatroom = activeChat.chatroom

              changeActiveChat(new_chat)
            } else if (activeChat instanceof Group) {
              const new_chat = new Group(snapshot.id, {
                name: snapshot.get('name'),
                photo: snapshot.get('photo'),
                description: snapshot.get('description'),
                memberIds: snapshot.get('members'),
                admin: snapshot.get('admin'),
                created: snapshot.get('created'),
              })

              await new_chat.fetchMembersData()

              new_chat.messages = activeChat.messages

              changeActiveChat(new_chat)
            }
          }
        )

        return unsub
      }

      return () => {}
    }

    return activeChatChanges(chat)
  }, [chat ? chat.id : null])

  return {
    activeChat: chat,
    changeActiveChat,
  }
}
