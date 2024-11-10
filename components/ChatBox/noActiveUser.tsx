import { memo } from 'react'

export default memo(function NoActiveuser() {
  return (
    <div className="w-full h-full flex flex-row items-center justify-center">
      <p className="text-white2">Select a user to start a coversation.</p>
    </div>
  )
})
