/* eslint-disable @next/next/no-img-element */
import { useState, useRef, forwardRef } from 'react'
import { useRouter } from 'next/navigation'
import getApp from '@/firebase'
import { IUser } from '@/context/auth.context'
import { getAuth } from 'firebase/auth'
import { CgProfile } from 'react-icons/cg'
import { FiSettings, FiLogOut } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import useOutClick from '@/hooks/outClick'

interface IMenuProps {
  user: IUser | null
}

interface IDropDownProps {}

const ProfileHandler = (router: any) => {
  router.push('/profile')
}
const SettingHandler = (router: any) => {
  router.push('/settings')
}
const LogoutHandler = (router: any) => {
  getAuth(getApp()).signOut()
  router.push('/')
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

const DropDown = forwardRef<HTMLDivElement>(function DropDown(
  props: IDropDownProps,
  ref
) {
  const router = useRouter()
  return (
    <motion.div
      ref={ref}
      className="z-10 absolute bottom-1 right-2 bg-black2 shadow-md translate-y-full overflow-hidden p-4 rounded-md"
      initial={{ opacity: 0, height: '0' }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: '0%' }}
    >
      <ul className="flex flex-col gap-3">
        {MENU_ITEMS.map((item, idx) => (
          <li key={idx}>
            <motion.button
              type="button"
              ariab-label="Menu item"
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                item.handler(router)
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
        className="relative w-7 h-7 rounded-full overflow-hidden border border-solid border-secondary sm:w-10 sm:h-10"
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

      <AnimatePresence>
        {openDropDown && <DropDown ref={dropDownRef} />}
      </AnimatePresence>
    </>
  )
}
