import {
  useRef,
  useState,
  useEffect,
  type ReactElement,
  type HTMLAttributes,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useOutClick from '@/hooks/outClick'
import Backdrop from './Backdrop'

interface IModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean
  onClose: () => void
  children: ReactElement
}

export default function Modal({
  open,
  onClose,
  children,
  className,
}: IModalProps) {
  const backdropRef = useRef<HTMLDivElement | null>(null)

  return (
    <AnimatePresence>
      {open && (
        <Backdrop
          ref={backdropRef}
          onClick={(event) => {
            if (event.target === backdropRef.current) onClose()
          }}
          className="flex flex-row items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`relative ${className}`}
          >
            {children}
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  )
}
