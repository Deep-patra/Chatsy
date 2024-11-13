import { useState, useEffect, useCallback, memo } from 'react'
import { MdClose } from 'react-icons/md'
import Image from './image'
import Backdrop from './Backdrop'
import Loader from './loader'
import { events } from './utils/events'
import { IPhoto } from '@/services'

const Loading = memo(function loading() {
  return (
    <div className="relative | w-full h-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-10 h-10">
        <Loader color="white" />
      </div>
    </div>
  )
})

export default function ImagePreview() {
  const [loading, changeLoading] = useState<boolean>(true)
  const [source, changeSource] = useState<string | null>(null)

  const [isOpen, changeIsOpen] = useState<boolean>(false)
  const [height, changeHeight] = useState<number>(0)

  const onLoad = useCallback(
    (event: any) => {
      const target = event.target as HTMLImageElement

      const naturalWidth = target.naturalWidth
      const naturalHeight = target.naturalHeight

      const aspectRatio = naturalHeight / naturalWidth
      const h = window.innerWidth * aspectRatio

      changeHeight(h)
      changeLoading(false)
    },
    [changeHeight, changeLoading]
  )

  const handleClose = useCallback(() => {
    changeIsOpen(false)
  }, [])

  useEffect(() => {
    const handleOpenPreview = (event: CustomEvent<IPhoto | string>) => {
      const detail = event.detail

      if (typeof detail === 'object') changeSource(detail.original_url)
      else if (typeof detail === 'string') changeSource(detail)

      changeIsOpen(true)
    }

    document.body.addEventListener(
      events.open_image_preview,
      handleOpenPreview as any
    )

    return () =>
      document.body.removeEventListener(
        events.open_image_preview,
        handleOpenPreview as any
      )
  }, [changeSource, changeIsOpen])

  if (!isOpen) return <></>

  return (
    <Backdrop className="bg-black/60">
      <>
        {/* Close Button */}
        <div className="w-full | absolute top-0 left-0 | flex flex-row items-center justify-end | p-2">
          <button type="button" onClick={handleClose}>
            <MdClose className="w-8 h-8 text-white1" />
          </button>
        </div>

        {/* Image */}
        <div className="w-full h-full | flex flex-row items-center justify-center">
          {source && (
            <>
              {/** loading **/}
              {loading && (<Loading/>)}

              {/** image **/}
              <Image
                data-show={!loading}
                style={{ width: '80vw', height: `${height}px` }}
                className="shadow-2xl | data-[show=false]:hidden"
                src={source}
                alt={source}
                onLoad={onLoad}
              />
            </>
          )}
        </div>
      </>
    </Backdrop>
  )
}
