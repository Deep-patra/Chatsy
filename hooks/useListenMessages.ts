import { useEffect } from 'react'
import { type QuerySnapshot, type DocumentData } from 'firebase/firestore'
import type { ChatInterface, IMessage } from '@/services'
import log from '@/components/utils/log'

export const useListenMessages = (
  chat: ChatInterface | null,
  cb?: (messages: IMessage[]) => void
) => {
  const callback = (snapshot: QuerySnapshot<DocumentData>) => {
    const changes = snapshot.docChanges()

    changes.forEach((change) => {
      if (change.type == 'added') {
        const doc = change.doc
        const data = change.doc.data()

        log("Messages received in 'useListenMessages:'", doc)

        chat!.pushMessages({
          id: doc.id,
          author: data.author,
          text: data.text || '',
          images: data.images || [],
          time: data.time,
        })

        if (cb && chat) cb(chat.messages)
      }
    })
  }

  useEffect(() => {
    let unsub = () => {}

    if (chat) unsub = chat.listenForMessages(callback)

    return () => {
      unsub()
    }
  }, [chat])
}
