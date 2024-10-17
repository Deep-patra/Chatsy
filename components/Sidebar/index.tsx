'use client'

import { motion } from 'framer-motion'
import { FaUsers, FaSearch } from 'react-icons/fa'
import { IoSettings } from 'react-icons/io5'
import { HiUserAdd } from 'react-icons/hi'
import { IoMdChatbubbles } from 'react-icons/io'
import { FiLogOut } from 'react-icons/fi'
import Tooltip from '../tootip'
import { events } from '../utils/events'

interface IButton {
  name: string
  icon: React.ReactNode
  onClick: () => void
}

const iconClassName = "w-5 h-5 text-inherit"
const buttons: IButton[] = [
  {
    name: 'Chats',
    icon: <IoMdChatbubbles className={iconClassName} />,
    onClick: () => {
      document.body.dispatchEvent(new Event(events.open_chats))
    }
  },

  {
    name: 'Groups',
    icon: <FaUsers className={iconClassName} />,
    onClick: () => {
      document.body.dispatchEvent(new Event(events.open_groups))
    }
  },

  {
    name: 'Search',
    icon: <FaSearch className={iconClassName} />,
    onClick: () => {
      document.body.dispatchEvent(new Event(events.open_search))
    }
  },

  {
    name: 'Invites',
    icon: <HiUserAdd className={iconClassName} />,
    onClick: () => {
      document.body.dispatchEvent(new Event(events.open_invites))
    }
  },
  
  {
    name: 'Settings',
    icon: <IoSettings className={iconClassName} />,
    onClick: () => {
      document.body.dispatchEvent(new Event(events.open_settings))
    }
  }
]

const SidebarButton = ({ button, className = "" }: { button: IButton, className?: string }) => {
  const { name, icon, onClick } = button

  return (
    <Tooltip text={name} position="right">
      <div className={`rounded-lg | hover:text-white hover:bg-midBlack2 ${className}`}>
        <button
          type="button"
          className="p-2 px-3 "
          onClick={onClick}
        >
          {icon}
        </button>
      </div>
    </Tooltip>
  )
}

export default function Siderbar() {

  return (
    <div className="h-full | p-2 px-1 | flex flex-col items-center justify-between | text-white2 | bg-black2 | rounded-md">
      <div className="flex flex-col items-center gap-2">
        {buttons.map((button, index) => (
          <SidebarButton key={index} button={button} />
        ))}            
      </div>

      <SidebarButton
        button={{
          name: "Logout",
          icon: <FiLogOut className={iconClassName} />,
          onClick: () => { document.body.dispatchEvent(new Event(events.open_logout)) },
         }} 
        />
    </div>
  )
}
