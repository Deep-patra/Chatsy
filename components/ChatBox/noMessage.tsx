import { memo } from 'react'

export default memo(function NoMessage() {
  return (
    <div className="w-full h-full flex flex-row items-center justify-center">
      <p className="text-white2">Start a conversation by saying Hi 👋.</p>
    </div>
  )
})
