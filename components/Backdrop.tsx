import { forwardRef, type ReactNode, type HTMLAttributes } from 'react'
import { motion } from 'framer-motion'

interface IBackdropProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export default forwardRef<HTMLDivElement | null, IBackdropProps>(
  function Backdrop({ children, className, ...props }: IBackdropProps, ref) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        ref={ref}
        className={`fixed top-0 left-0 w-screen h-screen backdrop-blur-sm ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
