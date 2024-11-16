import { NextRequest, NextResponse } from 'next/server'
import { POST } from '@/app/api/group/removeMember/route'
import { append, createDemoUser, deleteAllDocs } from '@/tests/utils'
import { db } from '@/utils/firebase_admin_app'
import { getUserFromSession } from '@/utils/getUserFromSession'
import { FieldValue } from 'firebase-admin/firestore'

// mock
jest.mock('@/utils/getUserFromSession', () => {
  return {
    __esModule: true,
    getUserFromSession: jest.fn()
  }
})

describe('POST /api/group/removeMember', () => {
  let user1Ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> | null = null
  let user2Ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> | null = null

  let groupRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> | null = null

  beforeAll(async () => {
    user1Ref = await createDemoUser({ name: 'josh', groups: [] })
    user2Ref = await createDemoUser({ name: 'tony', groups: [] })

    groupRef = await db.collection('groups').add({
      name: 'Demo User',
      description: 'This is a demo user.',
      admin: user1Ref!.id,
      members: [user1Ref!.id, user2Ref!.id]
    })

    await user1Ref.update({ groups: FieldValue.arrayUnion(groupRef!.id) })
    await user2Ref.update({ groups: FieldValue.arrayUnion(groupRef!.id) })
  }, 10000)

  afterAll(async () => {
    await deleteAllDocs('users', 'groups', 'groupInvites')
  }, 10000)

  test("Should return a response with the status 200", async () => {
    const f = new FormData()

    append(f, { group_id: groupRef!.id, member_id: user2Ref!.id })

    const req = new NextRequest(
      new URL("/api/group/removeMember", 'http://localhost:5000'),
      { method: 'POST', body: f }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() => Promise.resolve(user1Ref!.get()))

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.result).toBe('ok')

    const group = await groupRef!.get()
    const data = group.data()

    expect(data).toBeDefined()
    expect(data!.members.includes(user2Ref!.id)).toBe(false)
  })

  test("Should return an error when the user is not admin", async () => {
    const f = new FormData()

    append(f, { group_id: groupRef!.id, member_id: user2Ref!.id })

    const req = new NextRequest(
      new URL("/api/group/removeMember", 'http://localhost:5000'),
      { method: 'POST', body: f }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() => Promise.resolve(user2Ref!.get()))

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toBeDefined()
  })

  test("Should return an error when the group doesn't exists", async () => {
    const f = new FormData()

    append(f, { group_id: crypto.randomUUID(), member_id: user2Ref!.id })

    const req = new NextRequest(
      new URL("/api/group/removeMember", 'http://localhost:5000'),
      { method: 'POST', body: f }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() => Promise.resolve(user1Ref!.get()))

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toBeDefined()
  })
})
