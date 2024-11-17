import {
  useState,
  useRef,
  useContext,
  useCallback,
  type FormEventHandler,
  type MouseEvent,
} from 'react'
import classnames from 'classnames'
import { motion } from 'framer-motion'
import ImagePreview from './imagePreview'
import { BsImage } from 'react-icons/bs'
import { RiSendPlane2Line, RiSendPlane2Fill } from 'react-icons/ri'
import Tooltip from '../tootip'
import UserContext from '@/context/user.context'
import { ChatInterface } from '@/services'

interface ISendButtonProps {
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void
}

function SendButton(props: ISendButtonProps) {
  const [focus, changeFocus] = useState<boolean>(false)

  return (
    <Tooltip text="Send" position="top">
      <motion.button
        type="button"
        aria-label="Send button"
        whileTap={{ scale: 0.92 }}
        onMouseOver={() => {
          changeFocus(true)
        }}
        onMouseLeave={() => {
          changeFocus(false)
        }}
        onClick={(event) => {
          props.handleClick(event)
        }}
        className="w-9 h-9 p-1 rounded-full flex flex-row items-center justify-center text-white2 hover:text-white1 hover:bg-blue"
      >
        {focus ? (
          <RiSendPlane2Fill className="w-5 h-5 text-inherit" />
        ) : (
          <RiSendPlane2Line className="w-5 h-5 text-inherit" />
        )}
      </motion.button>
    </Tooltip>
  )
}

interface IMessageInputProps {
  chat: ChatInterface
}

function MessageInput({ chat }: IMessageInputProps) {
  const { user } = useContext(UserContext)

  const [text, changeText] = useState<string>('')
  const [file, changeFiles] = useState<File | null>(null)
  const [focus, changeFocus] = useState<boolean>(false)

  const imageInputRef = useRef<HTMLInputElement>(null)

  const sendMessage = useCallback(() => {
    if (user) chat.sendMessage(user.id, { text, image: file ?? undefined })
  }, [user, text, file])

  const handleChange: FormEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const target = event.target as HTMLInputElement
      changeText(target.value)
    },
    []
  )

  const handleKeyDown = useCallback(
    (event: any) => {
      if (event.key === 'Enter') {
        sendMessage()

        // reset after sending the message
        reset()
      }
    },
    [sendMessage]
  )

  const handleImageChange: FormEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const target = event.target as HTMLInputElement

      if (!target.files) {
        changeFiles(null)
        return
      }

      const f = target.files[0] ?? null
      changeFiles(f)
    },
    []
  )

  const removeFile = useCallback(() => {
    changeFiles(null)
  }, [])

  const reset = useCallback(() => {
    changeText('')
    changeFiles(null)
  }, [])

  const handleSend = async (event: MouseEvent<HTMLButtonElement>) => {
    if (text === '' && !file) return
    ;(event.target as HTMLButtonElement).disabled = true

    // send the message
    sendMessage()
    ;(event.target as HTMLButtonElement).disabled = false

    // reset the fields
    reset()
  }

  return (
    <div className="relative flex flex-row items-center w-full gap-2">
      {file && <ImagePreview {...{ file, removeFile }} />}

      <div
        className={classnames(
          'max-w-full flex-grow px-2 flex flex-row items-center rounded-md gap-2 border border-solid transition-colors',
          focus ? 'border-white1' : 'border-white3'
        )}
      >
        {/**Image file Input */}
        <input
          ref={imageInputRef}
          type="file"
          onChange={handleImageChange}
          max="3"
          multiple
          accept="image/*"
          className="hidden w-0 h-0"
        />

        <input
          value={text}
          autoFocus
          placeholder="Type Something ..."
          className="w-full flex-grow text-base text-white1"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            changeFocus(true)
          }}
          onBlur={() => {
            changeFocus(false)
          }}
        />

        <Tooltip text="Upload Image" position="top">
          <motion.button
            type="button"
            aria-label="select image button"
            whileTap={{ scale: 0.95 }}
            className="hover:bg-black3 hover:text-green p-2 ml-auto text-white2 rounded-full disabled:text-white3 disabled:cursor-not-allowed"
            onClick={() => {
              imageInputRef.current?.click()
            }}
          >
            <BsImage className="w-4 h-4 text-inherit" />
          </motion.button>
        </Tooltip>
      </div>

      <SendButton handleClick={handleSend} />
    </div>
  )
}

interface IMessageInputBoxProps {
  activeChat: ChatInterface
}

export default function MessageInputBox({ activeChat }: IMessageInputBoxProps) {
  return (
    <div
      style={{ gridRowStart: 3, gridRowEnd: 4 }}
      className="relative w-full flex flex-row items-end gap-2"
    >
      <MessageInput chat={activeChat} />
    </div>
  )
}
