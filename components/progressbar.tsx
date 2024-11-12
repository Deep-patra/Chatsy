import { motion } from 'framer-motion'

interface IProgressBarProps {
  show: boolean
}

export default function ProgressBar(props: IProgressBarProps) {
  if (!props.show) return <></> 

  return (
    <div className="h-1 w-screen absolute top-0 left-0 bg-transparent">
      <motion.div
        className="w-[60vw] h-full bg-white1"
        animate={{
          x: ['-60vw', '160vw'],
        }}
        transition={{
          duration: 1,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
      ></motion.div>
    </div>
  )
}
