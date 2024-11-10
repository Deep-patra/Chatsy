/* @jest-environment node */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import { POST } from '@/app/api/user/create/route'
import { db, storage } from '@/utils/firebase_admin_app'
import { append } from '@/tests/utils/formdata'

afterAll(async () => {

  // delete all user documents
  const docs = await db.collection('users').listDocuments()
  const promises = []

  for (const doc of docs) {
    promises.push(doc.delete())  
  }

  await Promise.all(promises)

  // cleanup images bucket
  await storage.bucket('images').deleteFiles()

  // cleanup thumbnail bucket
  await storage.bucket('thumbnails').deleteFiles()
}, 10000)

describe('POST /api/user/create', () => {
 
  test("Should return User", async () => {

    const uid = crypto.randomUUID()
    const name = "Deep patra"
    const description = "Hello! I am deep patra"
    const email = "deeppatra1999@gmail.com"
    

    const f = new FormData()
    append(f, { uid, name, description, email })

    const req = new NextRequest(new URL('/api/user/create', 'http://localhost:5000'), {
      method: 'POST',
      body: f
    })

    const res = await POST(req)

    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.id).toBeDefined()
    expect(json.name).toBe(name)
    expect(json.description).toBe(description)

    expect(json.contacts).toBeDefined()
    expect(json.contacts.length).toBe(0)

    expect(json.groups).toBeDefined()
    expect(json.groups.length).toBe(0)

    expect(json.created).toBeDefined()

    expect(json.photo).toBeDefined()
  }) 
  
  test("Should store the profile photo and generate a thumbnail", async () => {

    const uid = crypto.randomUUID()
    const name = "Deep patra"
    const description = "Hello! I am deep patra"
    const email = "deeppatra1999@gmail.com"

    const buffer = readFileSync(path.join(__dirname, "./user.png")) 
    const photo = new File([buffer], "user.png", { type: "image/png" })
    

    const f = new FormData()
    append(f, { uid, name, description, email, photo })

    const req = new NextRequest(new URL('/api/user/create', 'http://localhost:5000'), {
      method: 'POST',
      body: f
    })

    const res = await POST(req)

    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.id).toBeDefined()
    expect(json.name).toBe(name)
    expect(json.description).toBe(description)

    expect(json.contacts).toBeDefined()
    expect(json.contacts.length).toBe(0)

    expect(json.groups).toBeDefined()
    expect(json.groups.length).toBe(0)

    expect(json.created).toBeDefined()

    expect(json.photo).toBeDefined()
    expect(json.photo.uuid).toBeDefined()
    expect(json.photo.thumbnail_url).toBeDefined()
    expect(json.photo.original_url).toBeDefined()
  })

  test("Should return an error with message 'User UID is not present'", async () => {
    const name = "Deep patra"
    const description = "Hello! I am deep patra"
    const email = "deeppatra1999@gmail.com"
   

    const f = new FormData()
    append(f, { name, description, email })

    const req = new NextRequest(new URL('/api/user/create', 'http://localhost:5000'), {
      method: 'POST',
      body: f
    })

    const res = await POST(req)

    const json = await res.json()

    expect(res.status).toBe(400)

    expect(json.error).toBeDefined()
    expect(json.error).toBe("User UID is not present.")
  })

  test("Should return an error with a message 'Username'", async () => {
    const uid = crypto.randomUUID() 
    const description = "Hello! I am deep patra"
    const email = "deeppatra1999@gmail.com"
   

    const f = new FormData()
    append(f, { uid, description, email })

    const req = new NextRequest(new URL('/api/user/create', 'http://localhost:5000'), {
      method: 'POST',
      body: f
    })

    const res = await POST(req)

    const json = await res.json()

    expect(res.status).toBe(400)

    expect(json.error).toBeDefined()
    expect(json.error).toBe("Username is not present.")
  })

})
