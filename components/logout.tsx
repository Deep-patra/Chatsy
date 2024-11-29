import { useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getAuth } from 'firebase/auth'
import { getApp } from '@/firebase'
import { events } from './utils/events'
import UserContext from '@/context/user.context'
import Modal from './Modal'

export default function Logout() {
  const [isOpen, changeIsOpen] = useState<boolean>(false)

  const router = useRouter()

  const { setUser } = useContext(UserContext)

  const handleConfirmLogout = useCallback(() => {
    // Signout from the firebase
    getAuth(getApp()).signOut()

    // change the user to null
    setUser(null)

    // route to the index page
    router.push('/')
  }, [])

  const onClose = useCallback(() => {
    changeIsOpen(false)
  }, [])

  useEffect(() => {
    const handleOpenLogout = () => {
      changeIsOpen(true)
    }

    document.body.addEventListener(events.open_logout, handleOpenLogout)

    return () => {
      document.body.removeEventListener(events.open_logout, handleOpenLogout)
    }
  }, [])

  return (
    <Modal {...{ open: isOpen, onClose }}>
      <div className="logout-modal flex flex-col p-2 gap-1 border border-solid border-gray1 rounded-md bg-black2">
        {/*Header*/}
        <h4 className="text-white text-md md:text-lg">Logout</h4>

        <span className="text-white3 text-xs md:text-sm">
          You sure want to logout ?
        </span>

        {/* Confirm Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleConfirmLogout}
          className="text-xs p-1 px-2 ml-auto mt-2 rounded-sm bg-brightGreen text-black1 hover:scale-95  transition-all duration-200"
        >
          Confirm
        </motion.button>
      </div>
    </Modal>
  )
}
