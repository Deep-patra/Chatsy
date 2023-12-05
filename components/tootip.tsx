import {
  useRef,
  useState,
  cloneElement,
  useEffect,
  type ReactElement,
  type HTMLAttributes,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ITooltipProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactElement
  text: string
  position?: 'top' | 'bottom'
}

export default function Tooltip({
  text,
  children,
  position = 'bottom',
  ...props
}: ITooltipProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [dimen, setDimen] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })

  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const childRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const handleHover = (event: Event) => {
      if (childRef.current) {
        const childRect: DOMRect = childRef.current.getBoundingClientRect()

        if (position === 'bottom') {
          const top = childRect.bottom
          const left = childRect.left + childRect.width / 2

          setDimen({ top, left })
        }

        if (position === 'top') {
          const top = childRect.top
          const left = childRect.left + childRect.width / 2

          setDimen({ top, left })
        }
        // show the tooltip
        setIsOpen(true)
      }
    }

    const handleMouseOut = () => {
      setIsOpen(false)
    }

    if (childRef.current) {
      childRef.current.addEventListener('mouseover', handleHover)
      childRef.current.addEventListener('mouseout', handleMouseOut)
    }

    return () => {
      childRef.current &&
        childRef.current.removeEventListener('mouseover', handleHover)

      childRef.current &&
        childRef.current.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  return (
    <>
      {cloneElement(children, { ref: childRef })}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={tooltipRef}
            style={{
              top: `${dimen.top + 2}px`,
              left: `${dimen.left}px`,
              translateY: position === 'top' ? '-110%' : '0%',
            }}
            initial={{ scale: 0, opacity: 0, translateX: '-50%' }}
            animate={{ scale: 1, opacity: 1, translateX: '-50%' }}
            exit={{ scale: 0, opacity: 0, translateX: '-50%' }}
            className="text-sm rounded-md px-2 py-1 bg-black3 shadow-lg text-white1 fixed z-[100] "
          >
            {text || ''}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
