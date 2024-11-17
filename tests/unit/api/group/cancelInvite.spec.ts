import { NextRequest, NextResponse } from 'next/server'
import { POST } from '@/app/api/group/cancelInvite/route'
import { append, createDemoUser, deleteAllDocs } from '@/tests/utils'
import { db } from '@/utils/firebase_admin_app'
import { getUserFromSession } from '@/utils/getUserFromSession'

// mock
jest.mock('@/utils/getUserFromSession', () => {
  return {
    __esModule: true,
    getUserFromSession: jest.fn(),
  }
})

describe('POST /api/group/cancelInvite', () => {
  let user1Ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> | null =
    null
  let user2Ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> | null =
    null

  let groupRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> | null =
    null

  beforeAll(async () => {
    user1Ref = await createDemoUser({ name: 'josh' })
    user2Ref = await createDemoUser({ name: 'tony' })

    groupRef = await db.collection('groups').add({
      name: 'Demo User',
      description: 'This is a demo user.',
      admin: user1Ref!.id,
      members: [user1Ref!.id],
    })
  }, 10000)

  afterAll(async () => {
    await deleteAllDocs('users', 'groups', 'groupInvites')
  }, 10000)

  test('Should return a response with the status 200', async () => {
    const inviteRef = await db.collection('groupInvites').add({
      to: user2Ref!.id,
      from: user1Ref!.id,
      group_id: groupRef!.id,
    })

    const f = new FormData()
    append(f, { invite_id: inviteRef!.id })

    const req = new NextRequest(
      new URL('/api/group/cancelInvite', 'http://localhost:5000'),
      { method: 'POST', body: f }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() =>
      Promise.resolve(user1Ref!.get())
    )

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.result).toBe('ok')
  })

  test("Should return an error object, when the invite id doesn't exists", async () => {
    const f = new FormData()
    append(f, { invite_id: crypto.randomUUID() })

    const req = new NextRequest(
      new URL('/api/group/cancelInvite', 'http://localhost:5000'),
      { method: 'POST', body: f }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() =>
      Promise.resolve(user1Ref!.get())
    )

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toBeDefined()
  })

  test("Should return an error object, when the group doesn't exists", async () => {
    const inviteRef = await db.collection('groupInvites').add({
      to: user2Ref!.id,
      from: user1Ref!.id,
      group_id: crypto.randomUUID(),
    })

    const f = new FormData()
    append(f, { invite_id: inviteRef!.id })

    const req = new NextRequest(
      new URL('/api/group/cancelInvite', 'http://localhost:5000'),
      { method: 'POST', body: f }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() =>
      Promise.resolve(user1Ref!.get())
    )

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toBeDefined()
  })
})
