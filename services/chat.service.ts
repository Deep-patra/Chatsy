import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
  addDoc,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  arrayUnion,
  where,
  type Firestore,
  type DocumentSnapshot,
  type QuerySnapshot,
  type DocumentData,
  type Unsubscribe,
  type DocumentReference,
  serverTimestamp,
} from 'firebase/firestore'
import Storage from './storage.service'
import { db } from './db'
import { type IMessage } from '@/context/chat.context'

interface IAddMessageParams {
  text?: string
  images?: File[]
  authorId: string
}

async function imageFilesToUrls(images: File[]): Promise<string[]> {
  const promises: Promise<string | null>[] = []
  const urls: string[] = []

  images.forEach((image) => {
    promises.push(Storage.storeImage(image))
  })

  await Promise.all(promises).then((results) => {
    results.forEach((result) => {
      result && urls.push(result)
    })
  })

  return urls
}

export class MessageGroup {
  static async addMessage(
    messageGroupId: string,
    { authorId, text = '', images = [] }: IAddMessageParams
  ) {
    const imageURLs = await imageFilesToUrls(images)
    const messageRef = await addDoc(collection(db, 'message'), {
      authorId,
      messageGroupId,
      text,
      images: imageURLs,
      time: serverTimestamp(),
    })

    await updateDoc(doc(db, 'messageGroup', messageGroupId), {
      messages: arrayUnion(messageRef),
    })
  }
}

export type callback = (snapshot: QuerySnapshot<DocumentData>) => void

class ChatService {
  static async addMessage(
    messageGroupId: string,
    authorId: string,
    text: string = '',
    images: File[] = []
  ) {
    const message = await MessageGroup.addMessage(messageGroupId, {
      authorId,
      text,
      images,
    })
  }

  static async getMessages(
    messageGroupId: string,
    _limit: number = 30
  ): Promise<IMessage[]> {
    let messages: IMessage[] = []

    const q = query(
      collection(db, 'message'),
      where('messageGroupId', '==', messageGroupId),
      limit(_limit),
      orderBy('time', 'desc')
    )

    const results = await getDocs(q)

    results.forEach((result) => {
      const data = result.data()

      messages.push({
        authorId: data.authorId,
        text: data.text,
        images: data.images,
        time: data.time,
      })
    })

    return messages
  }

  static listenForMessages(messageGroupId: string, cb: callback): Unsubscribe {
    const q = query(
      collection(db, 'message'),
      where('messageGroupId', '==', messageGroupId),
      limit(30),
      orderBy('time', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      cb(snapshot)
    })

    return unsubscribe
  }
}

export default ChatService
