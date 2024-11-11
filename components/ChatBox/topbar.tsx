import { useState, useContext, useCallback } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import Dropdown from '@/components/dropdown'
import Image from '@/components/image'
import LoadingButton from '@/components/loadingButton'
import UserContext from '@/context/user.context'
import ChatContext from '@/context/chat.context'
import { User } from '@/services/user'
import { Contact } from '@/services/contact'
import { Group } from '@/services/group'
import { ChatInterface } from '@/services'
import { getPhotoURL } from '../utils/getPhotoURL'
import { dispatchSnackbarEvent } from '../utils/dispatchEvent'
import { events } from '../utils/events'

const getDropDownItems = (
  user: User,
  activeChat: ChatInterface,
  changeActiveChat: (new_chat: ChatInterface | null) => void
) => {
  const handleDeleteContact = (changeLoading: (ns: boolean) => void) => {
    if (activeChat instanceof Contact) {
      changeLoading(true)

      activeChat
        .delete(user.id)
        .then(() => {
          changeActiveChat(null)
          dispatchSnackbarEvent({
            type: 'success',
            text: `${activeChat.name} is removed`,
          })
        })
        .catch((error) => {
          dispatchSnackbarEvent({
            type: 'error',
            text: `cannot remove ${activeChat.name}`,
          })
          console.log(error)
        })
        .finally(() => changeLoading(false))
    }
  }

  const handleExitGroup = (changeLoading: (ns: boolean) => void) => {
    if (activeChat instanceof Group) {
      changeLoading(true)

      activeChat
        .delete(user.id)
        .then(() => {
          changeActiveChat(null)
          dispatchSnackbarEvent({
            type: 'success',
            text: `${activeChat.name} is removed`,
          })
        })
        .catch((error) => {
          dispatchSnackbarEvent({
            type: 'error',
            text: `cannot remove ${activeChat.name}`,
          })
        })
        .finally(() => changeLoading(false))
    }
  }

  const handleRemoveMember = () =>
    document.body.dispatchEvent(new Event(events.open_remove_member))

  const handleAddMember = () =>
    document.body.dispatchEvent(new Event(events.open_add_member))

  const handleDeleteGroup = (changeLoading: (ns: boolean) => void) => {
    if (activeChat instanceof Group) {
      changeLoading(true)

      activeChat
        .delete(user.id)
        .then(() => {
          changeActiveChat(null)
          dispatchSnackbarEvent({
            type: 'success',
            text: `${activeChat.name} deleted`,
          })
        })
        .catch((error) => {
          dispatchSnackbarEvent({
            type: 'error',
            text: `cannot delete ${activeChat.name}`,
          })
          console.error(error)
        })
        .finally(() => changeLoading(false))
    }
  }

  if (activeChat instanceof Contact) {
    return [
      <LoadingButton
        // @ts-ignore
        type="button"
        key="delete_contact"
        className="w-full | p-1 px-5 | text-white text-xs | rounded-md | bg-red-500 | hover:scale-x-95 hover:rounded-md | transition-all"
        onclick={handleDeleteContact}
      >
        delete
      </LoadingButton>,
    ]
  }

  if (activeChat instanceof Group && activeChat.admin !== user.id) {
    return [
      <LoadingButton
        // @ts-ignore
        type="button"
        key="exit_group"
        className="w-full | p-1 px-5 | bg-red-500 | text-white text-xs whitespace-nowrap | hover:scale-x-95 hover:rounded-md | transition-all"
        onclick={handleExitGroup}
      >
        exit
      </LoadingButton>,
    ]
  }

  return [
    <button
      type="button"
      key="add_member"
      className="w-full | p-1 | text-white text-xs whitespace-nowrap | hover:bg-black3 hover:text-brightGreen | transition-transform"
      onClick={handleAddMember}
    >
      Add member
    </button>,
    <button
      type="button"
      key="remove_member"
      className="w-full | p-1 | text-white text-xs whitespace-nowrap | hover:bg-black3 hover:text-brightGreen | transition-transform"
      onClick={handleRemoveMember}
    >
      Remove member
    </button>,
    <LoadingButton
      // @ts-ignore
      type="button"
      key="delete_group"
      className="w-full | p-1 | text-white text-xs whitespace-nowrap | bg-red-500 | transition-transform"
      onclick={handleDeleteGroup}
    >
      delete
    </LoadingButton>,
  ]
}

export default function TopBar() {
  const { user } = useContext(UserContext)
  const { activeChat, changeActiveChat } = useContext(ChatContext)

  const [isOpen, changeIsOpen] = useState<boolean>(false)

  if (!activeChat) return <></>

  return (
    <div
      style={{ gridRowStart: 1, gridRowEnd: 2 }}
      className="absolute top-0 lef-0 z-50 | p-1 | flex flex-row items-center justify-between | w-full h-fit | backdrop-blur-md | border-b-white3 border-b | bg-blacl/50"
    >
      <div className="flex flex-row items-center gap-2">
        {/* Profile Picture */}
        <Image
          src={getPhotoURL(activeChat.photo)}
          alt={activeChat.name}
          className="w-10 h-10 | border-2 border-white3 | rounded-full"
        />

        <span className="text-white">{activeChat.name}</span>
      </div>

      {/* Menu button */}
      <div className="flex flex-row items-center">
        <Dropdown
          open={isOpen}
          close={() => {
            changeIsOpen(false)
          }}
          items={getDropDownItems(user!, activeChat, changeActiveChat)}
        >
          <button
            type="button"
            className="p-2 | rounded-full | hover:bg-black2 hover:text-white1 | text-white2"
            onClick={() => {
              changeIsOpen(!isOpen)
            }}
          >
            <BsThreeDotsVertical className="w-5 h-5 text-inherit" />
          </button>
        </Dropdown>
      </div>
    </div>
  )
}
