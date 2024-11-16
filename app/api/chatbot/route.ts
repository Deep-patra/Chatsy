import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getUserFromSession } from '@/utils/getUserFromSession'
import { logger } from '@/utils/logger'

enum ChatBotEnum {
  USER = 'USER',
  CHATBOT = 'CHATBOT',
}

export const POST = async (req: NextRequest) => {
  try {
  
    const user = await getUserFromSession(req)

    const formdata = await req.formData()
    const prompt = String(formdata.get('prompt'))

    if (!prompt) throw new Error('Prompt is not present')

    if (!process.env.GEMINI_API_KEY)
      throw new Error('GEMINI API KEY is not present')

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const { response } = await model.generateContent(prompt)

    const text = response.text()

    logger.info({ text })

    return new NextResponse(JSON.stringify({ text }))
  } catch (error: any) {
    logger.info(error)
    return new NextResponse(
      JSON.stringify({ error: error.message || 'Invalid Request' }),
      { status: 400 }
    )
  }
}
