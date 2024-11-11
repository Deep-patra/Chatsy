import { memo } from 'react'
import { motion } from 'framer-motion'

interface ISwitchProps {
  enable: boolean
  toggle: () => void
}

export default memo(function Switch({ enable, toggle }: ISwitchProps) {
  return (
    <button
      data-enable={enable}
      className="relative | flex flex-row | h-[20px] w-[40px] | bg-black3 | rounded-2xl | outline outline-midBlack data-[enable=true]:bg-brightGreen | transition-colors duration-300"
      onClick={toggle}
    >
      {/* circle */}
      <motion.span
        initial={{ left: 0 }}
        animate={enable ? { left: '100%', x: '-100%' } : { left: 0 }}
        className="absolute top-0 bg-white1 block | rounded-full | h-[20px] w-[20px] | shadow-md"
      ></motion.span>
    </button>
  )
})
