import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import Loader from '@/components/loader'
import Modal from '@/components/Modal'
import { useIsMobile } from '@/hooks/useIsMobile'
import { events } from '../utils/events'

const Settings = dynamic(
  () => import('./settings'),

  {
    loading: () => {
      return (
        <div className="w-full h-full">
          <div className="w-10 h-10">
            <Loader color="whtie" />
          </div>
        </div>
      )
    },
  }
)

export default function SettingsComp() {
  const [isOpen, changeIsOpen] = useState<boolean>(false)

  const isMobile = useIsMobile()

  useEffect(() => {
    const eventHandler = () => changeIsOpen(true)

    document.body.addEventListener(events.open_settings, eventHandler)
    return () => {
      document.body.removeEventListener(events.open_settings, eventHandler)
    }
  }, [])

  if (isMobile) return <Settings />

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => changeIsOpen(false)}
        className="w-[500px] h-[500px] | bg-midBlack2 | rounded-md | border border-solid border-white3 | shadow-md | overflow-hidden"
      >
        <Settings />
      </Modal>
    </>
  )
}
