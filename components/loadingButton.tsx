import {
  useState,
  useCallback,
  type ReactNode,
  type ButtonHTMLAttributes,
} from 'react'
import Loader from './loader'

interface ILoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  onclick: (changeLoading: (ns: boolean) => void) => void
}

export default function LoadingButton({ children, onclick, ...props }: ILoadingButtonProps) {
  const [loading, changeLoading] = useState<boolean>(false)

  const handleClick = useCallback(() => {
    onclick(changeLoading)
  }, [changeLoading, onclick])

  return (
    <button {...props} onClick={handleClick}>
      {!loading && children}
      {loading && (
        <span className="block | w-5 h-5">
          <Loader color="white" />
        </span>
      )}
    </button>
  )
}
