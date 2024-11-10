import { useState, useContext, useMemo, memo, useDebugValue } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Timestamp } from 'firebase/firestore'
import UserContext from '@/context/user.context'
import ChatContext from '@/context/chat.context'
import Tooltip from '../tootip'
import Image from '@/components/image'
import { FiArrowRight } from 'react-icons/fi'
import { getPhotoURL } from '@/components/utils/getPhotoURL'
import log from '@/components/utils/log'
import type { IPhoto } from '@/services'
import { Group } from '@/services/group'
import { User } from '@/services/user'

interface InfoProps {
  photo: IPhoto | string
  name: string
  description: string
  created: Timestamp
}

const Info = memo(function info({ photo, name, description, created }: InfoProps) {
  log("created: ", created)

  return (
    <>
      <Image
        src={getPhotoURL(photo)}
        alt={name}
        style={{ backgroundImage: "linear-gradient(to right, #0f0c29, #302b63, #24243e)" }}
        className="w-32 h-32 | rounded-lg |  border-white2 | bg-midBlack | shadow-md"
      />
      <span className="text-lg text-brightGreen">{name}</span>

      {/* Joining date */}
      {created && (
        <p className="flex flex-row gap-2 items-center">
          <span className="text-xs text-white3">created on</span>
          <span className="text-xs text-white2">
            {created.toDate().toDateString()}
          </span>
        </p>
      )}

      {/* description */}
      {description && (
        <div className="w-full | m-1 mx-2 | rounded-md | bg-black2 | p-1 | flex flex-col gap-1">
          <span className="text-xs | text-white3 | p-1">description</span>
          <span className="text-xs text-white2 | p-1">{description}</span>
        </div>
      )}
    </>
  )
})


const variants = {
  open_bar: {
    maxWidth: 200
  },

  close_bar: {
    maxWidth: 40
  }
}

const button_variants = {
  open: {
    rotate: 0 
  },

  close: {
    rotate: 180
  }
}


export default function InfoBar() {
  const { user } = useContext(UserContext)
  const { activeChat } = useContext(ChatContext)

  const [isOpen, changeIsOpen] = useState<boolean>(true)

  // if the active chat is a group
  // get the members
  const members: User[] = useMemo(() => {
    // first get the admin from the members list
    // the admin needs to be at the top of the list
    if (!(activeChat instanceof Group)) return []

    const members = []

    const admin = activeChat.members.find(value => value.id ===  activeChat.admin)

    // if cannot find admin, return
    if (!admin) return []

    // admin needs to be the first element in the list
    members.push(admin)

    activeChat.members.forEach((value) => {
      value.id !== activeChat.admin ? members.push(value) : undefined
    })

    log(`Members in the ${activeChat.name} => `, members)

    return members
  }, [activeChat])


  if (!user && !activeChat)
    return <></>

  return (
    <motion.div
      style={{ gridRowStart: 2, gridRowEnd: 3}}
      className="hidden md:flex flex-col flex-grow gap-2 | max-w-[200px] min-w-0 w-full p-1 | rounded-md | bg-midBlack2 | overflow-hidden"
      animate={isOpen ? variants.open_bar : variants.close_bar} 
    >
      <motion.div
        className="w-full | flex flex-col items-center justify-center gap-2 | mt-10"
        animate={isOpen ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      >
        {/* show active chat info */}
        {activeChat && <Info { ...activeChat} />}

        {/* If no active chat is present, show user info */}
        {!activeChat && (
          <Info
            name={user!.name}
            description={user!.description}
            photo={user!.photo}
            created={user!.created}
          />
        )}
      </motion.div>

      {/* if active chat is a group, display the list of members */}
      {members.length > 0 && (
      <div className="flex flex-col gap-2 | w-full | overflow-hidden | decorate-scrollbar | overflow-y-scroll">

        <span className="text-sm text-white2 | px-1">
          <p className="text-inherit">members</p>
        </span>

          <ul className="flex flex-col gap-1">
            {members.map((member, index) => (
              <li
                key={member.id}
                className="p-1 | rounded-sm | flex flex-row items-center gap-2 | hover:bg-black2"
              >
                <Image
                  src={getPhotoURL(member.photo)}
                  alt={member.name}
                  className=" w-8 h-8 | rounded-full | border border-white1 | object-cover"
                />

                <span
                  className="text-xs text-white1 text-ellipsis | max-w-full | overflow-hidden"
                >{member.name}</span>
              </li>
            ))}
          </ul>
        </div>
        )}

      <div className="flex flex-row items-center | mt-auto | py-2 px-1">
        <Tooltip position={isOpen ? "top" : "left"} text={isOpen ? "collapse" : "open"}>
          <motion.button
            type="button"
            className="rounded-full | text-white2 | hover:bg-black2 hover:text-white"
            onClick={() => { changeIsOpen(!isOpen) }}
            animate={isOpen ? button_variants.open : button_variants.close}
          >
            <FiArrowRight className="w-6 h-6 text-inherit" />
          </motion.button>
        </Tooltip>
      </div>
    </motion.div>
  )
}
