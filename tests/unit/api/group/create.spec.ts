/** @jest-environment node */

import { NextRequest, NextResponse } from 'next/server'
import path from 'node:path'
import { readFileSync } from 'node:fs'
import {
  type DocumentReference,
  type DocumentData,
} from 'firebase-admin/firestore'
import { POST } from '@/app/api/group/create/route'
import {
  append,
  clearStorage,
  createDemoUser,
  deleteAllDocs,
} from '@/tests/utils'
import { getUserFromSession } from '@/utils/getUserFromSession'

// mock
jest.mock('@/utils/getUserFromSession.ts', () => {
  return {
    __esModule: true,
    getUserFromSession: jest.fn(),
  }
})

// Demo data
const group = {
  name: 'Demo Group',
  description: 'This is a description for the demo group.',
}

describe('POST /api/group/create', () => {
  let userRef: DocumentReference<DocumentData> | null = null

  beforeAll(async () => {
    userRef = await createDemoUser({
      name: 'Harry',
      description: "Hello, it's Harry.",
    })
  }, 10000)

  afterAll(async () => {
    await deleteAllDocs('users', 'groups')
    await clearStorage()
  }, 10000)

  test('Should return the group object', async () => {
    const f = new FormData()

    append(f, { name: group.name, description: group.description })

    const req = new NextRequest(
      new URL('/api/group/create', 'http://localhost:5000'),
      {
        method: 'POST',
        body: f,
      }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() =>
      Promise.resolve(userRef!.get())
    )

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)

    expect(json.id).toBeDefined()
    expect(json.name).toBe(group.name)
    expect(json.description).toBe(group.description)
  })

  test('SHould return an error when group name is not provided', async () => {
    const f = new FormData()

    append(f, { name: '', description: group.description })

    const req = new NextRequest(
      new URL('/api/group/create', 'http://localhost:5000'),
      {
        method: 'POST',
        body: f,
      }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() =>
      Promise.resolve(userRef!.get())
    )

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toBeDefined()
  })

  test('Should return a new group object with a photo url', async () => {
    const f = new FormData()

    const file = readFileSync(path.join(__dirname, './user.png'))
    const png = new File([file], 'user.png', { type: 'image/png' })

    append(f, {
      name: group.name,
      description: group.description,
      photo: png,
    })

    const req = new NextRequest(
      new URL('api/group/create', 'http://localhost:5000'),
      {
        method: 'POST',
        body: f,
      }
    )

    ;(getUserFromSession as jest.Mock).mockImplementation(() =>
      Promise.resolve(userRef!.get())
    )

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.id).toBeDefined()
    expect(json.name).toBe(group.name)
    expect(json.description).toBe(group.description)
    expect(json.photo).toBeDefined()
    expect(json.photo.thumbnail_url).toBeDefined()
    expect(json.photo.original_url).toBeDefined()
  })
})
