import { NextRequest, NextResponse } from "next/server";
import { type DocumentReference, type DocumentData } from 'firebase-admin/firestore'
import { clearStorage, createDemoUser, deleteAllDocs } from '@/tests/utils'

describe("POST /api/group/create", () => {
  
  let userRef: DocumentReference<DocumentData> | null = null

  beforeAll(async () => {
    userRef = await createDemoUser({ name: "Harry", description: "Hello, it's Harry." })
  })

  afterAll(async () => {
    await deleteAllDocs('users', 'groups') 
    await clearStorage()
  })

  test("Should return the group object", async () => {
    
  })
})
