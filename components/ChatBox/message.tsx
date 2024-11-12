import { useState, useEffect, useCallback, memo } from 'react'
import classnames from 'classnames'
import { IoMdResize } from 'react-icons/io'
import { Timestamp } from 'firebase/firestore'
import { ChatInterface, IMessage, IPhoto } from '@/services'
import { User } from '@/services/user'
import Image from '@/components/image'
import { getPhotoURL } from '../utils/getPhotoURL'
import { dispatchImagePreviewEvent } from '@/components/utils/dispatchEvent'

interface IImageSliderProps {
  images: string[]
}

interface ITextProps {
  text: string
}

const ProfilePicture = memo(function profilePicture({
  self,
  photo,
}: {
  self: boolean
  photo: IPhoto
}) {
  return (
    <Image
      className="w-10 h-10 | rounded-full | border border-white3 | bg-midBlack2"
      src={getPhotoURL(photo)}
      alt={'avatar'}
    />
  )
})

const Text = memo(function text(props: ITextProps) {
  return (
    <div className="p-1">
      <p className="text-sm md:text-md text-white1">{props.text}</p>
    </div>
  )
})

interface IMessageProps {
  user: User
  activeChat: ChatInterface
  message: IMessage
}

export default function Message({ user, activeChat, message }: IMessageProps) {
  const [height, changeHeight] = useState<number>(0)

  const self = user.id == message.author ? true : false
  const author = activeChat.getUserInfo(message.author)

  const onLoad = useCallback(
    (event: any) => {
      const target = event.target as HTMLImageElement

      const naturalWidth = target.naturalWidth
      const naturalHeight = target.naturalHeight

      const aspectRatio = naturalHeight / naturalWidth

      const h = 300 * aspectRatio
      changeHeight(h)
    },
    [changeHeight]
  )

  if (!author)
    return <></>


  return (
    <div
      className={classnames(
        'w-full flex flex-row items-start',
        self ? 'justify-end' : 'justify-start'
      )}
    >
      <div className="flex-shrink-1 | flex flex-row items-start p-2 gap-2">
        {/* Profile Picture */}
        {!self && <ProfilePicture self={self} photo={author.photo} />}

        {/* Message */}
        <div className="min-w-[200px] max-w-[450px] | flex flex-col justify-start gap-1 | rounded-lg p-2 bg-black2">
          <span className="font-semibold text-xs md:text-sm text-white2">
            {author.name}
          </span>

          {/* image */}
          {message.images && (
            <div className="relative | group">
              {/* Open image preview */}
              <button
                type="button"
                className="hidden | absolute top-1 right-1 z-10 | p-1 | rounded-full | bg-white/40 text-black1 | group-hover:block"
                onClick={() =>
                  message.images && dispatchImagePreviewEvent(message.images)
                }
              >
                <IoMdResize className="w-4 h-4 text-inherit" />
              </button>

              <Image
                style={{ width: `${300}px`, height: `${height}px` }}
                src={getPhotoURL(message.images)}
                alt={getPhotoURL(message.images)}
                onLoad={onLoad}
              />
            </div>
          )}

          <Text text={message.text} />
          <span
            className={classnames(
              'text-[0.5rem] text-white3',
              self ? 'ml-auto' : 'mr-auto'
            )}
          >
            {(message.time as Timestamp).toDate().toLocaleTimeString()}
          </span>
        </div>

        {/* Self profile picture */}
        {self && <ProfilePicture self={self} photo={author.photo} />}
      </div>
    </div>
  )
}
