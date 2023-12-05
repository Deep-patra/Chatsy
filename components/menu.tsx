/* eslint-disable @next/next/no-img-element */
import { useRef, forwardRef } from 'react'
import { getApp } from '@/firebase'
import { IUser } from '@/context/auth.context'
import { getAuth } from 'firebase/auth'
import { CgProfile } from 'react-icons/cg'
import { FiSettings, FiLogOut } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import useOutClick from '@/hooks/outClick'

interface IMenuProps {
  user: IUser | null
}

interface IDropDownProps {
  user: IUser
  toggle: (arg0: boolean) => void
}

const ProfileHandler = (user: IUser) => {
  // Dispatch event to open the profile modal
  document.body.dispatchEvent(new CustomEvent('OPEN_PROFILE', { detail: user }))
}
const SettingHandler = (user: IUser) => {
  // Dispatch Event to open the Setting modal
  document.body.dispatchEvent(new CustomEvent('OPEN_SETTING', { detail: user }))
}
const LogoutHandler = (router: any) => {
  // Dispatch Event to open the logout modal
  document.body.dispatchEvent(new CustomEvent('CONFIRM_LOGOUT'))
}

const ICON_CLASS = 'w-5 h-5 text-inherit'
const MENU_ITEMS = [
  {
    name: 'Profile',
    icon: <CgProfile className={ICON_CLASS} />,
    handler: ProfileHandler,
  },
  {
    name: 'Settings',
    icon: <FiSettings className={ICON_CLASS} />,
    handler: SettingHandler,
  },
  {
    name: 'Log out',
    icon: <FiLogOut className={ICON_CLASS} />,
    handler: LogoutHandler,
  },
]

const DropDown = forwardRef<HTMLDivElement, IDropDownProps>(function DropDown(
  { toggle, user }: IDropDownProps,
  ref
) {
  return (
    <motion.div
      ref={ref}
      className="z-10 absolute top-[110%] right-2 bg-black2 shadow-md translate-y-full overflow-hidden p-4 rounded-md"
      initial={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -10 }}
    >
      <ul className="flex flex-col gap-3">
        {/* Menu Item */}
        {MENU_ITEMS.map((item, idx) => (
          <li key={idx}>
            <motion.button
              type="button"
              ariab-label="Menu item"
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                item.handler(user)

                // close the menu
                toggle(false)
              }}
              className="flex flex-row gap-2 items-center text-white2 hover:text-white1"
            >
              {item.icon}
              <span>{item.name}</span>
            </motion.button>
          </li>
        ))}
      </ul>
    </motion.div>
  )
})

export default function Menu(props: IMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dropDownRef = useRef<HTMLDivElement>(null)

  const [openDropDown, toggleDropDown] = useOutClick(containerRef, dropDownRef)

  if (!props.user) return null

  const { name, photoURL, uid } = props.user

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-7 h-7 rounded-full overflow-hidden border border-solid border-secondary sm:w-8 sm:h-8"
      >
        <button
          type="button"
          className="w-full h-full relative"
          onClick={() => {
            toggleDropDown(!openDropDown)
          }}
        >
          <div className="w-full h-full relative">
            {photoURL ? (
              <img
                src={photoURL}
                referrerPolicy="no-referrer"
                alt={name || 'profile picture'}
                decoding="async"
                className="object-cover w-full h-full"
              />
            ) : (
              <canvas
                width="100"
                height="100"
                data-jdenticon-value={uid}
              ></canvas>
            )}
          </div>
        </button>
      </div>

      {/* Drop down */}
      <AnimatePresence>
        {openDropDown && (
          <DropDown
            ref={dropDownRef}
            toggle={toggleDropDown}
            user={props.user}
          />
        )}
      </AnimatePresence>
    </>
  )
}
