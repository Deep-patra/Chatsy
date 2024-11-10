/* @jest-environment node */
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue, type DocumentReference, type DocumentData } from 'firebase-admin/firestore'
import { POST } from "@/app/api/acceptInvite/route"
import { db } from '@/utils/firebase_admin_app'
import { append } from '@/tests/utils/formdata'
import { deleteAllDocs } from '@/tests/utils/deleteAllDocs'
import { createDemoUser } from '@/tests/utils/createDemoUser'

describe("POST /api/user/acceptInvite", () => {

  let user1Ref: DocumentReference<DocumentData> | null = null
  let user2Ref: DocumentReference<DocumentData> | null = null

  let inviteRef: DocumentReference<DocumentData> | null = null

  beforeAll(async () => {
    user1Ref = await createDemoUser({ name: "Harry", description: "Yo, I am Harry" })
    user2Ref = await createDemoUser({ name: "John", description: "Yo! I am John." })

    inviteRef = await db.collection("invites").add({
      from: user1Ref.id,
      to: user2Ref.id,
      time: FieldValue.serverTimestamp()
    })

  }, 10000)

  afterAll(async () => {
    
    await deleteAllDocs('chatrooms')
    await deleteAllDocs('users')
    await deleteAllDocs('invites')
  }, 10000)

  test("Should add the other user to the contact list", async () => {
    const f = new FormData()
    append(f, { invite_id: inviteRef?.id, user_id: user2Ref?.id })

    const req = new NextRequest(new URL('/api/acceptInvite', 'http://localhost:5000'), {
      method: 'POST',
      body: f
    })

    const res = await POST(req)

    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.result).toBe('ok')

    if (user1Ref && user2Ref) {
      const user1Doc = (await user1Ref.get()).data()
      const user2Doc = (await user2Ref.get()).data()

      expect(user1Doc).toBeDefined()
      expect(user2Doc).toBeDefined()

      expect(user1Doc?.contacts.length).toBeGreaterThan(0)
      expect(user2Doc?.contacts.length).toBeGreaterThan(0)
    }
  })

})
