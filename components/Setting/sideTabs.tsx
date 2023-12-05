import { useState, useTransition, type ReactElement } from 'react'
import { motion } from 'framer-motion'
import classnames from 'classnames'

interface ISidetabsProps {
  tabs: Record<string, ReactElement>
}

export default function SideTabs({ tabs }: ISidetabsProps) {
  const [activeTab, changeActiveTab] = useState<keyof typeof tabs>(
    Object.keys(tabs)[0]
  )

  const [pending, transition] = useTransition()

  return (
    <div className="w-full h-full flex flex-row gap-2">
      {/* Tabs */}
      <div className="flex flex-col gap-2 p-2 pr-5 border-r border-r-solid border-r-white3">
        {Object.keys(tabs).map((value, index) => (
          <motion.button
            key={index}
            whileTap={{ scale: 0.95 }}
            className={classnames('p-2 text-white1 text-md rounded-md', {
              'bg-black3': value === activeTab,
            })}
            onClick={() => {
              transition(() => {
                changeActiveTab(value)
              })
            }}
          >
            {value}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <div className="w-full p-2">{tabs[activeTab] || null}</div>
    </div>
  )
}
