import { readFileSync } from 'node:fs'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue, type DocumentReference, type DocumentData } from 'firebase-admin/firestore'
import { POST } from '@/app/api/sendMessage/route'
import { db } from '@/utils/firebase_admin_app'
import {
  append,
  createDemoUser,
  deleteAllDocs,
  clearStorage,
} from '@/tests/utils'

describe("POST /api/sendMessage", () => {

  let user1Ref: DocumentReference<DocumentData> | null = null
  let user2Ref: DocumentReference<DocumentData> | null = null

  let chatroom: DocumentReference<DocumentData> | null = null

  beforeAll(async () => {
    user1Ref = await createDemoUser({ name: 'Herry', description: "Yo it's Herry" })
    user2Ref = await createDemoUser({ name: "James", description: "Yo! it's a James" })

    chatroom = await db.collection('chatrooms').add({ members: [user1Ref.id, user2Ref.id] })

    await user1Ref.update({ contacts: FieldValue.arrayUnion({ chatroom_id: chatroom.id, user_id: user2Ref.id }) })
    await user2Ref.update({ contacts: FieldValue.arrayUnion({ chatroom_id: chatroom.id, user_id: user1Ref.id }) })
  })

  // messages need to be deleted after every test
  afterEach(async () => {
    await deleteAllDocs('messages')
  })

  afterAll(async () => {
    await deleteAllDocs('users')
    await deleteAllDocs('chatrooms')

    clearStorage('images', 'thumbnails')
  })

  test("Should create a message document", async () => {
    const f = new FormData()
    append(f, { user_id: user1Ref?.id, chatroom_id: chatroom?.id, text: "Hello!" })

    const req = new NextRequest(new URL('/api/sendMessage', 'http://localhost:5000'), {
      method: 'POST',
      body: f
    })

    const res = await POST(req)

    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.result).toBe('ok')

    const messages = await db.collection('messages').where('chatroom_id', '==', chatroom?.id).get()
    const docs = messages.docs

    for (const doc of docs) {
      const data = doc.data()

      expect(data?.author_id).toBe(user1Ref?.id)
      expect(data.chatroom_id).toBe(chatroom?.id)
      expect(data?.images.length).toBe(0)
      expect(data?.text).toBe("Hello!")
      expect(data?.time).toBeDefined()
    }
  })

  test("Should create a message document with the image", async () => {
    const f = new FormData()
  
    const file = readFileSync(path.join(__dirname, "./user.png"))
    const png = new File([file], "user.png", { type: 'image/png' })
    
    append(f, { user_id: user1Ref?.id, chatroom_id: chatroom?.id, text: "Hello!", image: png })

    const req = new NextRequest(new URL('/api/sendMessage', 'http://localhost:5000'), {
      method: 'POST',
      body: f
    })

    const res = await POST(req)

    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.result).toBe('ok')

    const messages = await db.collection('messages').where('chatroom_id', '==', chatroom?.id).get()
    const docs = messages.docs

    for (const doc of docs) {
      const data = doc.data()

      expect(data?.author_id).toBe(user1Ref?.id)
      expect(data.chatroom_id).toBe(chatroom?.id)
      expect(data?.images.length).toBe(0)
      expect(data?.text).toBe("Hello!")
      expect(data?.image).toBeDefined()
      expect(data?.image.thumbnail_url).toBeDefined()
      expect(data?.image.original_url).toBeDefined()
      expect(data?.time).toBeDefined()
    }
  })
})
