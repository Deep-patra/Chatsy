/** @jest-environment node */

import { NextRequest, NextResponse } from 'next/server'
import type { DocumentReference, DocumentData } from 'firebase/firestore'
import { db } from '@/utils/firebase_admin_app'
import { getUserFromSession } from '@/utils/getUserFromSession'
import { POST } from '@/app/api/group/sendInvite/route'
import { createDemoUser, clearStorage, deleteAllDocs, append } from '@/tests/utils'
import { FieldValue } from 'firebase-admin/firestore'

// mock
jest.mock('@/utils/getUserFromSession', () => {
  return {
    __esModule: true,
    getUserFromSession: jest.fn()
  }
})


describe('POST /api/group/sendInvite', () => {
  let user1Ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> | null = null
  let user2Ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> | null = null

  let groupRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> | null = null

  beforeAll(async () => {
    user1Ref = await createDemoUser({ name: "Robin" })
    user2Ref = await createDemoUser({ name: 'Harry' })

    groupRef = await db.collection('groups').add({
      name: "Demo Group",
      admin: user1Ref!.id,
      members: [user1Ref!.id],
      created: FieldValue.serverTimestamp()
    })
  }, 10000)

  afterAll(async () => {
    await deleteAllDocs('users', 'groups', 'groupInvites')
  }, 10000)


  test("Should return an Invite object with response status 200", async () => {
    const f = new FormData()

    append(f, { group_id: groupRef!.id, receiver_id: user2Ref!.id })

    const req = new NextRequest(
      new URL('/api/group/sendInvite', 'http://localhost:5000'),
      {
        method: 'POST',
        body: f
      }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() => Promise.resolve(user1Ref!.get()))

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.id).toBeDefined()
    expect(json.to).toBe(user2Ref!.id)
    expect(json.from).toBe(user1Ref!.id)
    expect(json.group_id).toBe(groupRef!.id)
   })

  test("Should return an error when the user is not the admin", async () => {
    const f = new FormData()

    append(f, { group_id: groupRef!.id, receiver_id: user2Ref!.id })

    const req = new NextRequest(
      new URL('/api/group/sendInvite', 'http://localhost:5000'),
      {
        method: 'POST',
        body: f
      }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() => Promise.resolve(user2Ref!.get()))

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toBeDefined()
  })

  test("Should return an error when the group doesn't exists", async () => {
    const f = new FormData()

    append(f, { group_id: crypto.randomUUID(), receiver_id: user2Ref!.id })

    const req = new NextRequest(
      new URL('/api/group/sendInvite', 'http://localhost:5000'),
      {
        method: 'POST',
        body: f
      }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() => Promise.resolve(user2Ref!.get()))

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toBeDefined()
  })

  test("Should return and error when the Invite receiving user doesn't exists", async () => {
    const f = new FormData()

    append(f, { group_id: groupRef!.id, receiver_id: crypto.randomUUID() })

    const req = new NextRequest(
      new URL('/api/group/sendInvite', 'http://localhost:5000'),
      {
        method: 'POST',
        body: f
      }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() => Promise.resolve(user2Ref!.get()))

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toBeDefined()
  })

  test("Should return an error when the group doesn't exists", async () => {
    const f = new FormData()

    append(f, { group_id: crypto.randomUUID(), receiver_id: user2Ref!.id })

    const req = new NextRequest(
      new URL('/api/group/sendInvite', 'http://localhost:5000'),
      {
        method: 'POST',
        body: f
      }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() => Promise.resolve(user2Ref!.get()))

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toBeDefined()
  })
})
