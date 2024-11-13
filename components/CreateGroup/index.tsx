import { useState, useEffect, useCallback, useContext } from 'react'
import GetNameAndDescription from './GetNameAndDescription'
import { IoCreate } from 'react-icons/io5'
import Modal from '@/components/Modal'
import CreateAvatar from '@/components/CreateAvatar'
import Loader from '@/components/loader'
import UserContext from '@/context/user.context'
import { Group } from '@/services/group'
import { events } from '@/components/utils/events'
import { fetchGroupAvatar } from '@/components/utils/fetchAvatar'
import log from '@/components/utils/log'

export default function CreateGroup() {
  const { user } = useContext(UserContext)

  const [loading, changeLoading] = useState<boolean>(false)
  const [isOpen, changeIsOpen] = useState<boolean>(false)

  const [name, changeName] = useState<string>('')
  const [description, changeDescription] = useState<string>('')
  const [source, changeSource] = useState<string>('')
  const [file, changeFile] = useState<File | null>(null)

  const handleClick = () => {
    if (!user) return

    // change loading state to true
    changeLoading(true)

    const photo = file ?? source

    Group.create(user.id, { name, description, photo })
      .then((group) => {
        log('Group created: ', group)
      })
      .catch(console.error)
      .finally(() => {
        changeLoading(false)

        // Close the Modal
        changeIsOpen(false)
      })
  }

  const refreshAvatar = useCallback(() => {
    fetchGroupAvatar(crypto.randomUUID())
      .then((res) => {
        if (res) changeSource(res)
      })
      .catch(console.error)
      .finally(() => {})
  }, [changeSource])

  useEffect(() => {
    const generateURL = (file: File | null) => {
      if (file) {
        const url = URL.createObjectURL(file)

        changeSource(url)

        return () => URL.revokeObjectURL(url)
      }

      return () => {}
    }

    return generateURL(file)
  }, [file])

  useEffect(() => {
    const handler = () => {
      changeIsOpen(true)
    }

    document.body.addEventListener(events.open_create_group, handler)

    // set avatar on mount
    refreshAvatar()

    return () => {
      document.body.removeEventListener(events.open_create_group, handler)
    }
  }, [refreshAvatar])

  return (
    <Modal
      open={isOpen}
      onClose={() => changeIsOpen(false)}
      className="flex flex-col gap-2 | w-[400px] h-[400px] min-h-0 | p-1 | rounded-md | bg-midBlack2"
    >
      <div className="w-full h-full | flex flex-col gap-3 | p-1 | overflow-hidden">
        <span className="text-white text-lg | p-1">Create Group</span>

        <div className="w-full h-full px-2 | decorate-scrollbar | overflow-y-scroll">
          <span className="text-sm text-white1">Group Picture</span>

          {/* Avatar */}
          <CreateAvatar
            {...{
              source,
              changeFile,
              refreshAvatar,
            }}
          />

          {/* Name and Description */}
          <GetNameAndDescription
            {...{
              name,
              description,
              changeName,
              changeDescription,
            }}
          />
        </div>

        <div className="text-brightGreen | flex flex-row items-center justify-end ">
          <button
            type="button"
            onClick={handleClick}
            disabled={name === ''}
            className="flex flex-row items-center gap-1 | p-1 px-2 | hover:bg-brightGreen hover:text-black1 | rounded-md | disabled:!bg-transparent disabled:!text-white3 | transition-colors duration-200"
          >
            {loading && (
              <div className="w-5 h-5">
                <Loader color="white" />
              </div>
            )}
            {!loading && (
              <>
                <IoCreate className="w-5 h-5 text-inherit" />
                <span className="text-xs text-inherit">Create</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
