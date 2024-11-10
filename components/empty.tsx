import { memo } from 'react'
import { GiCube } from 'react-icons/gi'

interface IEmptyProps {
  children: JSX.Element
}

export default memo(function Empty({ children }: IEmptyProps) {
  return (
    <>
      <div className="w-full h-full flex-grow | flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 items-center | text-white1">
          <GiCube className="w-8 h-8 text-inherit" />
          {children}
        </div>
      </div>
    </>
  )
})
