import { useState, useEffect } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'
import Modal from '@/components/Modal'
import Search from './search'
import { events } from '../utils/events'

export default function SearchComp() {
  const [isOpen, changeIsOpen] = useState<boolean>(false)

  const isMobile = useIsMobile()

  useEffect(() => {

    const handler = () => changeIsOpen(true)

    document.body.addEventListener(events.open_search, handler)

    return () => {
      document.body.removeEventListener(events.open_search, handler)
    }
  }, [])


  if (isMobile)
    return <Search/>

  return (
    <Modal
      open={isOpen}
      onClose={() => changeIsOpen(false)}
      className="w-[400px] h-[400px] | bg-midBlack2 | p-2 | rounded-md | shadow-md"
    >
      <Search/>
    </Modal>    
  )
}
