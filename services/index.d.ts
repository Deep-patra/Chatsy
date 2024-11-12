import { Unsubscribe } from "firebase/auth"

export interface IPhoto {
  uuid: string
  thumbnail_url: string
  original_url: string
}

export interface IMessage {
  id: string
  text: string | ''
  images: IPhoto | null
  author: string
  time: Timestamp
}

export interface InviteDisplayInfo {
  name: string
  photo: IPhoto | string
  time: Timestamp
}

export interface InviteInterface {
  id: string
  to: string
  from: string
  time: Timestamp

  getDisplayInfo: (user_id: string) => Promise<InviteDisplayInfo>
  accept: (user_id: string) => Promise<void>
  cancel: (user_id: string) => Promise<void>
}

export interface ChatInterface {
  id: string
  name: string
  photo: Iphoto | string
  description: string
  created: Timestamp
  messages: IMessage[]

  fetchMembersData: () => Promise<void>

  getMessages: (options: {
    offset?: number
    limit?: number
    order?: 'asc' | 'desc'
  }) => Promise<IMessage[]>

  pushMessages: (...messages: IMessage[]) => void
  getUserInfo: (user_id: string) => User
  sendMessage: (
    user_id: string,
    data: { text?: string; image?: File }
  ) => Promise<void>

  listenForChanges: (cb: (snaphost: DocumentSnapshot<DocumentData>) => void) => Unsubscribe
  listenForMessages: (cb: (snapshot: QuerySnapshot<DocumentData>) => void) => Unsubscribe
}
