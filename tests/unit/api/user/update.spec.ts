/** @jest-environment node */
import { NextRequest, NextResponse } from 'next/server'
import {
  type DocumentReference,
  type DocumentData,
} from 'firebase-admin/firestore'
import { getUserFromSession } from '@/utils/getUserFromSession'
import { POST } from '@/app/api/user/update/route'
import { db } from '@/utils/firebase_admin_app'

// mock
jest.mock('@/utils/getUserFromSession.ts', () => {
  return {
    __esModule: true,
    getUserFromSession: jest.fn()
  }
})


// Dummy User 
const user = {
  name: 'deep patra',
  description: 'Yo Yo!',
}

// Dummy Data to be Updated
const updated_data = {
  name: 'Deep patra',
  description: 'Hey! I am Deep patra.',
}

let userRef: DocumentReference<DocumentData> | null = null

/**
 * Create a new user in the firestore database 
 * before all the tests
 * */
beforeAll(async () => {
  // Create an new user
  userRef = await db.collection('users').add({
    name: user.name,
    description: user.description,
  })
}, 10000)


/**
 * Delete the user after all the tests
 * */
afterAll(async () => {
  // cleanup the database
  if (userRef) await userRef.delete()
})

it('POST /api/user/update: Update the document with name and description and should get status 200', async () => {
  const formdata = new FormData()

  if (userRef) formdata.append('user_id', userRef.id)
  formdata.append('name', updated_data.name)
  formdata.append('description', updated_data.description)

  const request = new NextRequest(
    new URL('/api/user/update', 'http://localhost:500'),
    {
      method: 'POST',
      body: formdata,
    }
  )

  ;( getUserFromSession as jest.Mock).mockImplementation((req: NextRequest) => Promise.resolve(userRef!.get()))

  const response = await POST(request).catch((error) => {
    fail(error)
  })

  const json = await response.json()

  expect(response.status).toBe(200)

  expect(json.id).toBe(userRef!.id)
  expect(json.name).toBe(updated_data.name)
  expect(json.description).toBe(updated_data.description)
})
