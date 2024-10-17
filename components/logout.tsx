import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getAuth } from 'firebase/auth'
import { getApp } from '@/firebase'
import { events } from './utils/events'
import Modal from './Modal'

export default function Logout() {
  const [isOpen, changeIsOpen] = useState<boolean>(false)

  const router = useRouter()

  const handleConfirmLogout = () => {
    // Signout from the firebase
    getAuth(getApp()).signOut()
    router.push('/')
  }

  const handleOpenLogout = () => {
    changeIsOpen(true)
  }

  const onClose = () => {
    changeIsOpen(false)
  }

  useEffect(() => {
    document.body.addEventListener(events.open_logout, handleOpenLogout)

    return () => {
      document.body.removeEventListener(events.open_logout, handleOpenLogout)
    }
  }, [])

  return (
    <Modal {...{ open: isOpen, onClose }}>
      <div className="logout-modal flex flex-col p-2 gap-2 rounded-md bg-black2">
        {/*Header*/}
        <h4 className="text-white1 text-md md:text-lg">Logout</h4>

        <span className="text-white2 text-sm md:text-md">
          You sure want to logout ?
        </span>

        {/* Confirm Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleConfirmLogout}
          className="py-1 px-2 w-min ml-auto mt-2 rounded-md border border-solid border-green text-green hover:bg-green hover:text-white1 transition-colors"
        >
          Confirm
        </motion.button>
      </div>
    </Modal>
  )
}
