import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ISidebarProps {
  children: JSX.Element
}

export default function Sidebar(props: ISidebarProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null)

  const [open, toggle] = useState<boolean>(false)

  // Effect to listen to the OPEN_MENU event
  useEffect(() => {
    const handleToggleMenu = () => {
      toggle(true)
    }

    document.body.addEventListener('OPEN_MENU', handleToggleMenu, false)

    return () => {
      document.body.removeEventListener('OPEN_MENU', handleToggleMenu, false)
    }
  }, [toggle])

  // Effect to add click event listener to the overlay
  useEffect(() => {
    open &&
      overlayRef.current?.addEventListener(
        'click',
        () => {
          toggle(false)
        },
        { once: true }
      )
  }, [open])

  return (
    <>
      <div
        style={{ gridRowStart: 2, gridRowEnd: 3 }}
        className="w-[250px] flex-shrink-0 hidden md:block bg-black2 my-5 ml-2 rounded-lg p-1 overflow-hidden shadow-md"
      >
        {props.children}
      </div>

      <AnimatePresence>
        {open && (
          <div className="fixed top-0 left-0 z-10 w-screen h-screen">
            <div
              ref={overlayRef}
              style={{ gridRowStart: 2, gridRowEnd: 3 }}
              className="fixed top-0 left-0 block h-screen md:hidden w-screen bg-[rgba(0, 0, 0, 0.2)] backdrop-blur-sm"
            ></div>
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0' }}
              exit={{ x: '-100%' }}
              className="w-[80vw] z-10 px-5 bg-black2 absolute top-0 left-0 my-2 h-[98%] rounded-tr-xl rounded-br-xl p-1 overflow-hidden shadow-md"
            >
              {props.children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
