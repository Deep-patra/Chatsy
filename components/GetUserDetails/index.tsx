'use client'

import { useContext, useState, useCallback, useEffect, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'
import UserContext from '@/context/user.context'
import NameAndDescription from './nameAndDesc'
import CreateAvatar from '@/components/CreateAvatar'
import Loader from '@/components/loader'
import { fetchUserAvatar } from '@/components/utils/fetchAvatar'
import { getPhotoURL } from '../utils/getPhotoURL'

export default function GetUserDetails() {
  const { user, setUser } = useContext(UserContext)

  const router = useRouter()

  const [currentPage, changeCurrentPage] = useState<number>(0)
  const [loading, changeLoading] = useState<boolean>(false)

  const [name, changeName] = useState<string>(user ? user.name ?? '' : '')
  const [description, changeDescription] = useState<string>(
    user ? user.description ?? '' : ''
  )
  const [source, changeSource] = useState<string>(
    getPhotoURL(user ? user.photo : '')
  )
  const [file, changeFile] = useState<File | null>(null)

  const handleNameChange = useCallback((event: any) => {
    const input = event.target as HTMLInputElement
    const value = input.value

    changeName(value)
  }, [])

  const handleDescriptionChange = useCallback((event: any) => {
    const textarea = event.target as HTMLTextAreaElement
    const value = textarea.value

    changeDescription(value)
  }, [])

  const refreshAvatar = useCallback(() => {
    // name will be the seed
    fetchUserAvatar(name)
      .then((res) => {
        if (res) {
          changeSource(res)
          changeFile(null)
        }
      })
      .catch(console.error)
  }, [name])

  const handleNext = () => {
    if (currentPage === 1 && user) {
      // show loading
      changeLoading(true)

      const photo = file ?? source
      user
        .update({ name, photo, description })
        .then(() => {
          if (user)
            user
              .update({ name, photo, description })
              .then(() => router.push('home'))
              .catch(console.error)
              .finally(() => changeLoading(true))
        })
        .catch(console.error)
        .finally(() => changeLoading(false))
    }

    if (currentPage === 0) changeCurrentPage(currentPage + 1)
  }

  useEffect(() => {
    if (name && currentPage === 1 && source === '') refreshAvatar()
  }, [name, currentPage])

  return (
    <div
      style={{ gridRowStart: 2, gridRowEnd: 3 }}
      className="flex flex-row items-center justify-center"
    >
      <div className="min-w-[200] max-w-[400px] min-h-[200px] flex flex-col gap-2 flex-grow | bg-black1 | rounded-md | p-2 | shadow-md ">
        <span className="text-lg text-brightGreen p-1">
          Before you get started.
        </span>

        <form
          action=""
          encType="multipart/form-data"
          className="relative | overflow-hidden"
        >
          <AnimatePresence>
            <motion.div
              className="flex flex-col gap-4 p-1"
              key={currentPage}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{
                x: -50,
                opacity: 0,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              {currentPage === 0 && (
                <NameAndDescription
                  {...{
                    name,
                    description,
                    onNameChange: handleNameChange,
                    onDescriptionChange: handleDescriptionChange,
                  }}
                />
              )}

              {currentPage === 1 && (
                <CreateAvatar
                  {...{
                    source,
                    changeFile,
                    refreshAvatar,
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </form>

        <div className="w-full | flex flex-row items-center justify-between | p-2">
          <button
            type="button"
            className="text-brightGreen | hover:bg-brightGreen hover:text-black1 | rounded-full | p-2 | disabled:!bg-transparent disabled:text-white3 | transition-colors duration-300"
            disabled={currentPage === 0}
            onClick={() => changeCurrentPage(currentPage - 1)}
          >
            <IoIosArrowBack className="w-5 h-5 text-inherit" />
          </button>

          <button
            type="button"
            className="text-brightGreen | hover:bg-brightGreen hover:text-black1 | rounded-full | p-2 | disabled:!bg-transparent disabled:text-white3 | transition-colors duration-300"
            disabled={name === ''}
            onClick={handleNext}
          >
            {loading && (
              <div className="flex flex-row items-center justify-center | w-5 h-5">
                <Loader color="white" />
              </div>
            )}

            {!loading && <IoIosArrowForward className="w-5 h-5 text-inherit" />}
          </button>
        </div>
      </div>
    </div>
  )
}
