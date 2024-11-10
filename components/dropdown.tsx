import { useState, useRef, cloneElement, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useOutClick from '../hooks/outClick'

interface IDropDownProps {
  open: boolean
  close: () => void
  items: JSX.Element[]
  children: JSX.Element
}


export default function DropDown({ open, close, items, children }: IDropDownProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const childRef = useRef<HTMLDivElement | null>(null)

  useOutClick(open, close, childRef, dropdownRef)

  return (
    <div ref={childRef} className="relative | flex flex-row items-ceter justify-center">

        {children}
    
        {
          open && (
            <motion.div
              className="pt-2 | absolute top-full right-0 | rounded-md | bg-black2 | z-[100] | border-gray1 border-solid border | shadow-md | overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ ease: 'circOut', duration: 0.1 }}
              ref={dropdownRef}
            >
              {/* Dropdown list */}
              <ul className="flex flex-col | w-full">

                {/* Dropdown Item */}
                {items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}

              </ul> 
            </motion.div>
          )
        }
    </div>
  )
}
