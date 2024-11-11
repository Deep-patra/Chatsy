import { useState, useRef, useEffect, useCallback } from 'react'
import { MdRefresh, MdOutlineFileUpload } from 'react-icons/md'
import Loader from '@/components/loader'
import Image from '@/components/image'

interface ICreateAvatarProps {
  disabled?: boolean
  source: string
  refreshAvatar: () => void
  changeFile: (file: File) => void
}

export default function CreateAvatar({
  source,
  refreshAvatar,
  changeFile,
  disabled = false,
}: ICreateAvatarProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Refresh the avatar
  const handleRefreshAvatar = useCallback(() => {
    refreshAvatar()
  }, [])

  const handleUpload = useCallback(() => {
    if (inputRef.current) inputRef.current.click()
  }, [])

  const handleFileUpload = useCallback((event: any) => {
    const target = event.target as HTMLInputElement
    const new_file = target.files && target.files[0]

    inputRef.current!.files = null

    if (new_file) changeFile(new_file)
  }, [])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-row items-center justify-center | w-[200px] h-[200px] | rounded-md | bg-midBlack2 | shadow-xl | overflow-hidden">
        {!source && (
          <div className="w-14 h-14">
            <Loader color="white" />
          </div>
        )}

        {source && <Image src={source} className="w-full h-full" />}
      </div>

      <div className="flex flex-row items-center gap-1">
        <button
          type="button"
          disabled={disabled}
          className="flex flex-row items-center gap-1 | p-1 px-2 | bg-brightPurple rounded-md | disabled:hidden | hover:scale-95 | transition-all duration-200"
          onClick={handleRefreshAvatar}
        >
          <MdRefresh className="w-5 h-5 text-black1" />
          <span className="text-xs text-black1">refresh avatar</span>
        </button>

        <button
          type="button"
          disabled={disabled}
          className="flex flex-row items-center gap-1 | p-1 px-2 | bg-brightPurple rounded-md | disabled:hidden | hover:scale-95 | transition-all duration-200"
          onClick={handleUpload}
        >
          <input
            type="file"
            className="appearance-none w-0 h-0 opacity-0 hidden"
            ref={inputRef}
            onChange={handleFileUpload}
          />
          <MdOutlineFileUpload className="w-5 h-5 text-black1" />
          <span className="text-xs text-black1">upload</span>
        </button>
      </div>
    </div>
  )
}
