import { useState, useRef, cloneElement, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useOutClick from '../hooks/outClick'

interface IDropDownItem {
  icon: JSX.Element | null
  text: string
  onClick: () => void
}

interface IDropDownProps {
  open: boolean
  close: () => void
  items: IDropDownItem[]
  children: JSX.Element
}


export default function DropDown({ open, close, items, children }: IDropDownProps) {
  const [position, changePosition] = useState({ top: 0, left: 0 })

  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const childRef = useRef<HTMLElement | null>(null)

  useOutClick(open, close, childRef, dropdownRef)

  useEffect(() => {
    if (open && childRef.current) {
      
      const childRect = childRef.current.getBoundingClientRect()

      changePosition({
        top: childRect.bottom + 10,
        left: childRect.left
      })

    }
  }, [childRef.current, open])

  return (
    <>
      {cloneElement(children, { ref: childRef })}

      <AnimatePresence>
        {
          open && (
            <motion.div
              style={{ top: `${position.top}px`, left: `${position.left}px` }}
              className="fixed | rounded-md | bg-black2 | p-2 | z-50 | shadow-md"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              ref={dropdownRef}
            >
              {/* Dropdown list */
              <ul className="flex flex-col w-full">

                {/* Dropdown Item */}
                {items.map((item, index) => (
                    <motion.li
                      key={item.text}
                    >
                      <button
                        type="button"
                        className="flex flex-row items-center"
                        onClick={item.onClick}
                      >
                        {item.icon && item.icon}
                        <span
                          className=""
                        >{item.text}</span>
                      </button>
                    </motion.li>
                ))}

              </ul> 
            </motion.div>
          )
        }
      </AnimatePresence>
    </>
  )
}
