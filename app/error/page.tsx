import { MdError } from 'react-icons/md'

export default function Page() {
  return (
    <div className="w-full h-full | flex flex-col gap-2 items-center justify-center">
      <MdError className="w-10 h-10 text-red-500" />
      <span className="text-xs text-white1" >An Error Occurred !</span>
    </div>
  )
}
