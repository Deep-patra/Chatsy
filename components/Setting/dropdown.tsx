import { useState, type ReactElement } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoIosArrowUp } from 'react-icons/io'

interface IDropdownProps {
  text: string
  children: ReactElement
}

export default function Dropdown({ text, children }: IDropdownProps) {
  const [isOpen, changeIsOpen] = useState<boolean>(false)

  return (
    <div className="relative w-full flex flex-col gap-2">
      <motion.button
        className="p-2 flex flex-row gap-2 items-center justify-between bg-black3 text-white2 rounded-md"
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          changeIsOpen(!isOpen)
        }}
      >
        {/* Drop down title */}
        <span className="text-inherit">{text}</span>

        {/* Arrow */}
        <motion.span
          initial={{ rotateZ: 0 }}
          animate={{ rotateZ: isOpen ? 180 : 360 }}
          className="text-inherit"
        >
          <IoIosArrowUp className="w-4 h-4 text-inherit" />
        </motion.span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="w-full"
            initial={{ scale: 0, opacity: 0, translateY: -5 }}
            animate={{ scale: 1, opacity: 1, translateY: 0 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
