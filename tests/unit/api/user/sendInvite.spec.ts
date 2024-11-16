/* @jest-environment node */
import { NextRequest, NextResponse } from 'next/server'
import {
  FieldValue,
  type DocumentReference,
  type DocumentData,
} from 'firebase-admin/firestore'
import { POST } from '@/app/api/sendInvite/route'
import { getUserFromSession } from '@/utils/getUserFromSession'
import { db } from '@/utils/firebase_admin_app'
import { append } from '@/tests/utils/formdata'
import { deleteAllDocs } from '@/tests/utils/deleteAllDocs'
import { createDemoUser } from '@/tests/utils/createDemoUser'


// mock
jest.mock('@/utils/getUserFromSession.ts', () => {
  return {
    __esModule: true,
    getUserFromSession: jest.fn()
  }
})


describe('POST /api/sendInvite', () => {
  let user1Ref: DocumentReference<DocumentData> | null = null
  let user2Ref: DocumentReference<DocumentData> | null = null


  // Create two Demo Users
  beforeAll(async () => {
    user1Ref = await createDemoUser({
      name: 'Herry',
      description: "Yo it's Herry",
    })
    user2Ref = await createDemoUser({
      name: 'James',
      description: "Yo! it's a James",
    })
  }, 10000)

  // Cleanup all the documnents
  afterAll(async () => {
    await deleteAllDocs('users')
    await deleteAllDocs('invites')
    await deleteAllDocs('chatrooms')
  }, 10000)

  test('Should return a invite object', async () => {
    const f = new FormData()
    append(f, { to: user2Ref?.id })

    const req = new NextRequest(
      new URL('/api/sendInvite', 'http://localhost:5000'),
      {
        method: 'POST',
        body: f,
      }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() => Promise.resolve(user1Ref!.get()))

    const res = await POST(req)

    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.id).toBeDefined()
    expect(json.from).toBe(user1Ref?.id)
    expect(json.to).toBe(user2Ref?.id)
    expect(json.time).toBeDefined()
  })

  test('Should return an error when the user id is invalid', async () => {
    const f = new FormData()
    append(f, { to: crypto.randomUUID() })

    const req = new NextRequest(
      new URL('/api/sendInvite', 'http://localhost:5000'),
      {
        method: 'POST',
        body: f,
      }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() => Promise.resolve(user1Ref!.get()))

    const res = await POST(req)

    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toBeDefined()
  })

})
