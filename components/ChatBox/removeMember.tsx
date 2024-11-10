import { useState, useContext, useMemo, useEffect, useCallback, memo } from 'react'
import Image from '@/components/image'
import Modal from '@/components/Modal'
import { IoIosRemoveCircleOutline } from 'react-icons/io'
import { BiConfused } from 'react-icons/bi'
import UserContext from '@/context/user.context'
import ChatContext from '@/context/chat.context'
import { Group } from '@/services/group'
import { getPhotoURL } from '../utils/getPhotoURL'
import { events } from '../utils/events' 
import { User } from '@/services/user'


const NoMember = memo(function noMember() {
  return (
    <li className="flex flex-col items-center gap-2 | p-1 | text-white2">
     <BiConfused className="w-10 h-10 text-inherit" /> 
      <span className="text-white2 text-xs">no members to remove !</span>
    </li>
  ) 
})


export default function RemoveMember() {
  const { user } = useContext(UserContext)
  const { activeChat } = useContext(ChatContext)

  const [isOpen, changeIsOpen] = useState<boolean>(false)


  const members = useMemo(() => {
    let members: User[] = []
    if (activeChat instanceof Group) {
      members = activeChat.members.filter((value) => value.id !== activeChat.admin ? value : undefined)
    }
    
    return members 
  }, [activeChat])

  const handleRemove = useCallback((member: User) => {
    
    if (activeChat instanceof Group && user)
      activeChat.removeMember(user.id, member.id)
        .catch(console.error)

  }, [activeChat, user])


  useEffect(() => {
    const handleOpenRemoveMember = () => changeIsOpen(true)

    document.body.addEventListener(events.open_remove_member, handleOpenRemoveMember)

    return () => document.body.removeEventListener(events.open_remove_member, handleOpenRemoveMember)
  }, [])

  return (
    <Modal
      className="w-[300px] max-h-[400px] | flex flex-col gap-3 | p-2 | bg-black3 | rounded-md"
      {...{ open: isOpen, onClose: () => { changeIsOpen(false) } }}
    >
      <>
        <span className="text-white text-sm">Remove member</span>
        <ul className="flex flex-col gap-1">
          {members.length > 0 && members.map((member) => (
            <li key={member.id} className="relative | flex flex-row items-center gap-2 | p-1 rounded-md | group | hover:bg-black2 hover:px-2 | transition-all | duration-200">
              {/* member picture */}
              <Image
                src={getPhotoURL(member.photo)}
                className="w-10 h-10 | rounded-full | border-2 border-white3 | group-hover:border-white1"
              />

              {/* member name */}
              <span className="text-xs text-white | max-w-[70%] text-ellipsis">{member.name}</span>

              {/* remove button */}
              <button
                type="button"
                className="group-hover:flex flex-row items-center gap-1 | hidden | ml-auto p-1 px-2 rounded-md | text-white | bg-red-500 | hover:scale-95 | transition-transform"
                onClick={() => handleRemove(member)}
              >
                <IoIosRemoveCircleOutline className="w-5 h-5 text-inherit" />
                <span className="text-xs text-inherit">Remove</span>
              </button>
            </li>
          ))}

          {/* No members to remove */}
          {members.length == 0 && ( <NoMember/> )}
        </ul>
      </>
    </Modal>
  )
}
