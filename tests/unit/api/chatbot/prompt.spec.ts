/* @jest-enviroment node */

import { NextRequest, NextResponse } from 'next/server'
import path from 'node:path'
import { POST } from '@/app/api/chatbot/route'
import { config } from 'dotenv'

describe('POST /api/chatbot/', () => {
  beforeAll(() => {
    config({ path: path.join(__dirname, '../../../../.env.local') })
  })

  test('Should return a result from the given prompt', async () => {
    const formdata = new FormData()
    formdata.append('prompt', 'Explain to me how AI works')

    const req = new NextRequest(
      new URL('/api/chatbot', 'http://localhost:5000'),
      {
        method: 'POST',
        body: formdata,
      }
    )

    const res = await POST(req)

    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.text).toBeDefined()
    expect(typeof json.text).toBe('string')
  })
})
