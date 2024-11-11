import {
  useState,
  useCallback,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import Loader from './loader'

interface ILoadingButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  onclick: (changeLoading: (ns: boolean) => void) => void
}

export default function LoadingButton(props: ILoadingButtonProps) {
  const [loading, changeLoading] = useState<boolean>(false)

  const handleClick = useCallback(() => {
    props.onclick(changeLoading)
  }, [changeLoading, props.onclick])

  return (
    <button {...props} onClick={handleClick}>
      {!loading && props.children}
      {loading && (
        <span className="block | w-5 h-5">
          <Loader color="white" />
        </span>
      )}
    </button>
  )
}
