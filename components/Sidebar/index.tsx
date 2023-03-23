import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useOutClick from '@/hooks/outClick'

interface ISidebarProps {
  children: JSX.Element
}

export default function Sidebar(props: ISidebarProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  const [open, toggle] = useOutClick(overlayRef)

  useEffect(() => {
    const handleToggleMenu = () => {
      toggle(true)
    }

    document.body.addEventListener('OPEN_MENU', handleToggleMenu, false)

    return () => {
      document.body.removeEventListener('OPEN_MENU', handleToggleMenu, false)
    }
  }, [])

  return (
    <>
      <div
        style={{ gridRowStart: 2, gridRowEnd: 3 }}
        className="min-w-[20vw] max-w-[25vw] hidden md:block bg-black2 my-5 rounded-tr-xl rounded-br-xl p-1 overflow-hidden shadow-md"
      >
        {props.children}
      </div>

      <AnimatePresence>
        {open && (
          <div
            style={{ gridRowStart: 2, gridRowEnd: 3 }}
            ref={overlayRef}
            className="fixed z-10 top-0 left-0 block h-screen md:hidden w-screen bg-[rgba(0, 0, 0, 0.2)] backdrop-blur-sm"
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0' }}
              exit={{ x: '-100%' }}
              className="w-[80vw] px-5 bg-black2 absolute top-0 left-0 my-2 h-[98%] rounded-tr-xl rounded-br-xl p-1 overflow-hidden shadow-md"
            >
              {props.children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
