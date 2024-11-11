import {
  useRef,
  useState,
  cloneElement,
  useEffect,
  type ReactElement,
  type HTMLAttributes,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import log from './utils/log'

interface ITooltipProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactElement
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export default function Tooltip({
  text,
  children,
  position = 'bottom',
  ...props
}: ITooltipProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [translateStyle, changeTranslateStyle] = useState<{
    x: string
    y: string
  }>({ x: '', y: '' })
  const [dimen, setDimen] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })

  const childRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const handleHover = (event: Event) => {
      if (childRef.current) {
        const childRect: DOMRect = childRef.current.getBoundingClientRect()

        // Set the top, left and translation style
        // based on the position
        switch (position) {
          case 'bottom': {
            const top = childRect.bottom + 5
            const left = childRect.left + childRect.width / 2

            changeTranslateStyle({
              x: '-50%',
              y: '0',
            })

            setDimen({ top, left })
            break
          }

          case 'top': {
            const top = childRect.top - 5
            const left = childRect.left + childRect.width / 2

            changeTranslateStyle({
              x: '-50%',
              y: '-100%',
            })

            setDimen({ top, left })
            break
          }

          case 'left': {
            const top = childRect.top + childRect.height / 2
            const left = childRect.left - 5

            changeTranslateStyle({
              x: '-100%',
              y: '-50%',
            })

            setDimen({ top, left })

            break
          }

          case 'right': {
            const top = childRect.top + childRect.height / 2
            const left = childRect.left + childRect.width + 5

            changeTranslateStyle({
              x: '0',
              y: '-50%',
            })

            setDimen({ top, left })
            break
          }
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
  }, [childRef.current, position])

  return (
    <>
      {cloneElement(children, { ref: childRef })}
      <AnimatePresence>
        {isOpen && text != '' && (
          <motion.div
            style={{
              top: `${dimen.top}px`,
              left: `${dimen.left}px`,
              translateY: `${translateStyle.y}`,
              translateX: `${translateStyle.x}`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm rounded-md px-2 py-1 bg-black3 shadow-lg text-white1 fixed z-[100] pointer-events-none"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
