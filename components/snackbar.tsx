import { useState, useEffect, useCallback } from 'react'
import { MdInfo, MdCheckCircle, MdClose } from 'react-icons/md'
import { BiError } from 'react-icons/bi'
import { motion, AnimatePresence } from 'framer-motion'
import { events } from '@/components/utils/events'

interface ISnackbar {
  id: string
  type: 'success' | 'info' | 'error'
  text: string
  remainingTime: number
}

export default function Snackbar() {
  const [items, changeItems] = useState<ISnackbar[]>([])

  const handleRemoveItem = useCallback((items: ISnackbar[], id: string) => {
    const new_items = items.filter((item) =>
      id === item.id ? undefined : item
    )
    changeItems([...new_items])
  }, [])

  useEffect(() => {
    const handleOpenSnackbar = (event: CustomEvent<ISnackbar>) => {
      const { text, type } = event.detail

      changeItems(
        items.concat({
          text,
          type,
          id: crypto.randomUUID(),
          remainingTime: 5000,
        })
      )
    }

    document.body.addEventListener(
      events.open_add_snackbar,
      handleOpenSnackbar as any
    )

    return () =>
      document.body.removeEventListener(
        events.open_add_snackbar,
        handleOpenSnackbar as any
      )
  }, [items])

  return (
    <div
      style={{}}
      className="fixed bottom-2 right-2 z-[1000] max-h-[300px] | flex flex-col gap-1"
    >
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            data-type={item.type}
            className="flex flex-row items-center gap-2 | p-1 | rounded-sm | text-white1 | data-[type=error]:bg-red-500 data-[type=success]:bg-brightGreen data-[type=info]:bg-brightBlue"
          >
            {/* Snackbar icon */}
            <span className="text-inherit">
              {item.type === 'success' && (
                <MdCheckCircle className="w- h-5 text-inherit" />
              )}
              {item.type === 'error' && (
                <BiError className="w-5 h-5 text-inherit" />
              )}
              {item.type === 'info' && (
                <MdInfo className="w-5 h-5 text-inherit" />
              )}
            </span>

            {/* Snackbar text */}
            <span className="min-w-[100px] max-w-[250px] | text-inherit text-sm text-ellipsis | overflow-hidden | w-full">
              {item.text}
            </span>

            <button
              type="button"
              className="flex flex-row items-center jusitfy-center"
              onClick={() => handleRemoveItem(items, item.id)}
            >
              <MdClose className="w-4 h-4 text-inherit" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
