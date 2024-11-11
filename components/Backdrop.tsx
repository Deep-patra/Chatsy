import { forwardRef, type ReactNode, type HTMLAttributes } from 'react'
import { type MotionProps } from 'framer-motion'
import { motion } from 'framer-motion'

interface IBackdropProps extends MotionProps {
  className: string
  children: ReactNode
  onClick?: (event: any) => void
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
        <>{children}</>
      </motion.div>
    )
  }
)
