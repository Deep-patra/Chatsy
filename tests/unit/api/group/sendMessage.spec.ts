import { NextRequest, NextResponse } from 'next/server'
import path from 'node:path'
import { readFileSync } from 'node:fs'
import { POST } from '@/app/api/group/sendMessage/route'
import { append, clearStorage, createDemoUser, deleteAllDocs } from '@/tests/utils'
import { db } from '@/utils/firebase_admin_app'
import { getUserFromSession } from '@/utils/getUserFromSession'

// mock
jest.mock('@/utils/getUserFromSession', () => {
  return {
    __esModule: true,
    getUserFromSession: jest.fn()
  }
})


describe('POST /api/group/sendMessage', () => {
  let user1Ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> | null = null
  
  let groupRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> | null = null
  
  beforeAll(async () => {
    user1Ref = await createDemoUser({ name: 'josh', groups: [] })
    
    groupRef = await db.collection('groups').add({
      name: 'Demo User',
      description: 'This is a demo user.',
      admin: user1Ref!.id,
      members: [user1Ref!.id]
    })
  })

  afterAll(async () => {
    await deleteAllDocs('users', 'groups', 'groupMessages')
    await clearStorage('images', 'thumbnails')
  })

  test("Should return a message object with the 200 status response", async () => {
    const text = "this is a test message"

    const f = new FormData()
    append(f, { group_id: groupRef!.id, text })

    const req = new NextRequest(
      new URL('/api/group/sendMessage', 'http://localhost:5000'),
      { method: 'POST', body: f }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() => Promise.resolve(user1Ref!.get()))

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.result).toBe('ok')
  })

  test("Should return a message object with photo url ", async () => {
    
    const text = "this is a test message"

    const file = readFileSync(path.join(__dirname, "./user.png"))
    const png = new File([file], 'user.png', { type: 'image/png' })

    const f = new FormData()
    append(f, { group_id: groupRef!.id, text , images: png })

    const req = new NextRequest(
      new URL('/api/group/sendMessage', 'http://localhost:5000'),
      { method: 'POST', body: f }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() => Promise.resolve(user1Ref!.get()))

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.result).toBe('ok')
  })

  test("Should return an error when the request body is empty", async () => {
    const f = new FormData()
    append(f, { group_id: groupRef!.id })

    const req = new NextRequest(
      new URL('/api/group/sendMessage', 'http://localhost:5000'),
      { method: 'POST', body: f }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() => Promise.resolve(user1Ref!.get()))

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toBeDefined()
  })
})
