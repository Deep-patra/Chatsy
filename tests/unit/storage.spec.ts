/** @jest-environment node */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { storeFile } from '@/components/utils/storage'

it("Should return a public URL ", async () => {
  const file = readFileSync(path.join(__dirname, './headshot.jpg')) 

  const url = await storeFile(new File([file], 'headshot.jpeg'))

  expect(url).toBeDefined()
})
