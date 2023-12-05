import { forwardRef, type ReactElement, type HTMLAttributes } from 'react'

interface IBackdropProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactElement
}

export default forwardRef<HTMLDivElement | null, IBackdropProps>(
  function Backdrop({ children, className, ...props }: IBackdropProps, ref) {
    return (
      <div
        ref={ref}
        className={`fixed top-0 left-0 w-screen h-screen backdrop-blur-sm ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)
