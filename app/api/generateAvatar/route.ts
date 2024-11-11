import { NextRequest, NextResponse } from 'next/server'
import { createAvatar } from '@dicebear/core'
import {
  funEmoji,
  bigSmile,
  lorelei,
  micah,
  miniavs,
  adventurer,
  avataaarsNeutral,
  loreleiNeutral,
  notionistsNeutral,
  adventurerNeutral,
} from '@dicebear/collection'
import { logger } from '@/utils/logger'

const MODULES = [
  funEmoji,
  bigSmile,
  lorelei,
  micah,
  miniavs,
  adventurer,
  avataaarsNeutral,
  loreleiNeutral,
  notionistsNeutral,
  adventurerNeutral,
]

const getRandomAvatar = (seed: string): string => {
  const index = Math.floor(Math.random() * MODULES.length)
  const m = MODULES[index]

  const uri = createAvatar(m as any, {
    scale: 100,
    size: 96,
  }).toDataUri()

  return uri
}

export const GET = (req: NextRequest) => {
  try {
    const seed = req.nextUrl.searchParams.get('seed')

    if (!seed) throw new Error('name is required')

    const uri = getRandomAvatar(seed)

    return new NextResponse(JSON.stringify({ dataURI: uri }), { status: 200 })
  } catch (error: any) {
    logger.error(error)
    return new NextResponse(
      JSON.stringify({ error: error.message || 'cannot generate avatars' }),
      { status: 400 }
    )
  }
}
