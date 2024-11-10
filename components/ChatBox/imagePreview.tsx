import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MdClose } from 'react-icons/md'
import Image from '@/components/image'

interface IImagePreviewProps {
  file: File | null
  removeFile: () => void
}

export default function ImagePreview({ file, removeFile }: IImagePreviewProps) {
  const [source, changeSource] = useState<string | null>(null)

  useEffect(() => {
    const fileToUrl = () => {
      if (file) {
        const url = URL.createObjectURL(file)
        changeSource(url)

        return () => URL.revokeObjectURL(url)
      }

      return () => {}
    }

    return fileToUrl()
  }, [file, changeSource])


  if (!source && !file)
    return <></>

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.95 }}
      animate={{ opacity: 1, y: "-100%", scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-1 | p-2 | rounded-md | absolute -top-2 left-2 | z-10 bg-black2"
    >
      <button
        type="button"
        className="ml-auto | text-white1"
        onClick={removeFile}
      >
        <MdClose className="w-4 h-4 text-inherit" />
      </button>

      <Image
        src={source!}
        alt={source!}
        className="w-[200px] h-[150px] | rounded-md | overflow-hidden"
      /> 
    </motion.div>
  )
}
