import Tooltip from '../tootip'
import { FaUsers, FaSearch } from 'react-icons/fa'
import { IoSettings } from 'react-icons/io5'
import { HiUserAdd } from 'react-icons/hi'
import { IoMdChatbubbles } from 'react-icons/io'
import { CiSearch } from 'react-icons/ci'

interface IButton {
  name: string
  icon: React.ReactNode
  onClick: () => void
}

const iconClassName = "w-6 h-6 text-inherit"
const buttons: IButton[] = [
  {
    name: 'Chats',
    icon: <IoMdChatbubbles className={iconClassName} />,
    onClick: () => {}
  },

  {
    name: 'Groups',
    icon: <FaUsers className={iconClassName} />,
    onClick: () => {}
  },

  {
    name: 'Search',
    icon: <FaSearch className={iconClassName} />,
    onClick: () => {}
  },

  {
    name: 'Invites',
    icon: <HiUserAdd className={iconClassName} />,
    onClick: () => {}
  },
  
  {
    name: 'Settings',
    icon: <IoSettings className={iconClassName} />,
    onClick: () => {}
  }
]

const SidebarButton = ({ button }: { button: IButton }) => {
  const { name, icon, onClick } = button
  return (
    <Tooltip text={name} position="right">
      <div className="p-2 | rounded-lg">
        <button
          type="button"
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
    <div className="h-full | p-2 | flex flex-col items-center gap-2 | text-white2 | bg-black2 | rounded-md">
      {buttons.map((button, index) => (
        <SidebarButton key={index} button={button} />
      ))}            
    </div>
  )
}
