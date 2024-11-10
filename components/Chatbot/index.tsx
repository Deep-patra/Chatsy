import { useState, useCallback, useTransition } from 'react'
import * as marked from 'marked'
import DOMPurify from 'dompurify'
import Input from '@/components/input'
import { Chatbot } from '@/services/chatbot'
import { IoSendSharp } from 'react-icons/io5'
import log from '../utils/log'

enum ChatEnum {
  USER = "USER",
  CHATBOT = "CHATBOT"
}

interface IChatbotMsg {
  text: string
  type: ChatEnum
}


export default function ChatBot() {
  const [loading, changeLoading] = useState<boolean>(false)
  const [value, changeValue] = useState<string>('')
  const [messages, changeMessages] = useState<IChatbotMsg[]>([])

  const [pending, transition] = useTransition()

  const handleChange = useCallback((event: any) => {
    const target = event.target as HTMLInputElement
    changeValue(target.value)
  }, [])

  const handleSubmit = () => {
    const curr_value = value
    const new_messages = messages.concat({ text: curr_value, type: ChatEnum.USER })

    changeMessages(new_messages)
    changeLoading(true)
    changeValue("")

    Chatbot.sendMessage(curr_value)
      .then(async (text) => {
        if (text)
          changeMessages([ ...new_messages, {
            text: DOMPurify.sanitize(await marked.parse(text)),
            type: ChatEnum.CHATBOT,
          } ])
      })
      .catch(console.error)
      .finally(() => {
        changeLoading(false)
      })

  }

  return (
    <>
      {/* Top bar */}
      <div
        style={{ gridRowStart: 1, gridRowEnd: 2 }}
        className="z-10 | absolute top-0 left-0 | w-full h-[50px] | bg-black/50 | rounded-md | backdrop-blur-md"
      >

      </div>

      {/* Chat Container */}
      <div
        style={{ gridRowStart: 1, gridRowEnd: 3 }}
        className="p-2 pt-[50px] | w-full | overflow-y-auto | decorate-scrollbar">
        <ul className="h-max w-full | flex flex-col justify-end gap-3">
          {messages.length !== 0 && (
            messages.map((message, index) => (
              <li
                key={index}
                style={{ justifyContent: message.type === ChatEnum.USER ? "end" : "start" }}
                className="w-full h-min | flex flex-row"
              >
                <div
                  key={index}
                  className="max-w-[70%] | p-2 | rounded-md | bg-midBlack2 | text-sm"
                >
                  <span
                    className="text-sm text-white1"
                    dangerouslySetInnerHTML={{
                      __html: message.type === ChatEnum.USER ?
                      `<p>${message.text}</p>`
                      : message.text
                    }}
                  >
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/** Input Box **/}
      <div
        style={{ gridRowStart: 3, gridRowEnd: 4 }}
        className="flex-grow | px-1 | flex flex-row items-center gap-2 | w-full">
        <Input
          value={value}
          placeholder="type something..."
          onChange={handleChange}
          className="text-sm"
        />

        <button
          type="button"
          disabled={loading}
          onClick={handleSubmit}
          className="text-white2 | p-1 | hover:text-brightGreen | rounded-md"
        >
          <IoSendSharp className="w-6 h-6 text-inherit" />
        </button>
      </div>
    </>
  )
}
