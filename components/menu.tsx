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

export default function Menu(props: IMenuProps) {
  if (!props.user) return null

  const { name, photoURL, uid } = props.user

  return (
    <>
      <div
        className="relative w-7 h-7 rounded-full overflow-hidden border border-solid border-secondary sm:w-8 sm:h-8"
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
      </div>
    </>
  )
}
