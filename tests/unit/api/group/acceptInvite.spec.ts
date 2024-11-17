import { NextRequest, NextResponse } from 'next/server'
import { POST } from '@/app/api/group/acceptInvite/route'
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

describe('POST /api/group/acceptInvite', () => {
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

  test('Should return a response of status 200', async () => {
    const inviteRef = await db.collection('groupInvites').add({
      to: user2Ref!.id,
      from: user1Ref!.id,
      group_id: groupRef!.id,
    })

    const f = new FormData()
    append(f, { invite_id: inviteRef!.id })

    const req = new NextRequest(
      new URL('/api/group/accpetInvite', 'http://localhost:5000'),
      { method: 'POST', body: f }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() =>
      Promise.resolve(user2Ref!.get())
    )

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.result).toBe('ok')

    const group = await groupRef!.get()
    expect(group.get('members').includes(user2Ref!.id)).toBe(true)
  })

  test('Should return an error if invite id is invalid', async () => {
    const f = new FormData()
    append(f, { invite_id: crypto.randomUUID() })

    const req = new NextRequest(
      new URL('/api/group/accpetInvite', 'http://localhost:5000'),
      { method: 'POST', body: f }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() =>
      Promise.resolve(user2Ref!.get())
    )

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toBeDefined()
  })

  test('Should return an error object when the group does not exists', async () => {
    const inviteRef = await db.collection('groupInvites').add({
      to: user2Ref!.id,
      from: user1Ref!.id,
      group_id: crypto.randomUUID(),
    })

    const f = new FormData()

    append(f, { invite_id: inviteRef!.id })

    const req = new NextRequest(
      new URL('/api/group/accpetInvite', 'http://localhost:5000'),
      { method: 'POST', body: f }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() =>
      Promise.resolve(user2Ref!.get())
    )

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toBeDefined()
  })
})
