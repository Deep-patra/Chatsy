import { NextRequest, NextResponse } from 'next/server'
import { createAvatar } from '@dicebear/core'
import {
  shapes,
  rings,
  glass,
  icons,
  identicon
} from '@dicebear/collection'
import { logger } from '@/utils/logger'

const MODULES = [
  shapes,
  rings,
  glass,
  identicon
]

const getRandomURI = (seed: string): string => {
  const randomIndex = Math.floor(Math.random() * MODULES.length)
  const m = MODULES[randomIndex]

  const uri = createAvatar(m as any, {
    scale: 100,
    size: 96
  }).toDataUri()

  return uri
}

export const GET = async (req: NextRequest) => {
  try {

    const seed = req.nextUrl.searchParams.get('seed')

    if (!seed)
      throw new Error("Seed is not present in the request")

    const uri = getRandomURI(seed)

    return new NextResponse(JSON.stringify({ dataURI: uri }), { status: 200 })

  } catch(error: any) {
    logger.error(error)
    return new NextResponse(JSON.stringify({ error: error.message || "Invalid request" }), { status: 400 })
  }
}
