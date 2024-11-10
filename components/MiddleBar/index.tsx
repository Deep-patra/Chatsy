import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { events } from '../utils/events'
import ContactLists from  '../ContactsList'
import GroupLists from '../GroupsList'
import InviteLists from '../InvitesList'
import log from '@/components/utils/log'

interface IOpenedState {
  chats: boolean
  groups: boolean
  invites: boolean
}

export default function MiddleBar() {

  const [openedState, changeOpenedState] = useState<IOpenedState>({
    chats: true,
    groups: false,
    invites: false,
  })

  const getKey = useCallback(() => {
    let key = "chats"
    openedState.groups && ( key = "groups" )
    openedState.invites && ( key = "invites" )

    return key
  }, [openedState])


  useEffect(() => {

    const handleListener = (event: Event) => {
      const state = { chats: false, groups: false, invites: false }

      switch(event.type) {
        case events.open_chats:
          state.chats = true
          break
        case events.open_groups:
          state.groups = true
          break
        case events.open_invites:
          state.invites = true
          break
      }

      changeOpenedState(state)
    }

    document.body.addEventListener(events.open_chats, handleListener)
    document.body.addEventListener(events.open_groups, handleListener)
    document.body.addEventListener(events.open_invites,  handleListener)

    return () => {
      document.body.removeEventListener(events.open_chats, handleListener)
      document.body.removeEventListener(events.open_groups, handleListener)
      document.body.removeEventListener(events.open_invites, handleListener)
    }
  }, [])

  return (
    <div
      className="relative | h-full | min-w-[200px] max-w-[400px] | rounded-md | bg-midBlack2 | overflow-hidden"
    >
      <AnimatePresence>
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: '0', opacity: 1 }}
          exit={{ x: '-100%', opacity: 0, position: 'absolute', top: 0, left: 0 }}
          transition={{ ease: 'circOut', duration: 0.2 }}
          key={getKey()}
          className="h-full"
        >
          {openedState.chats && <ContactLists key="chats" />}
          {openedState.groups && <GroupLists key="groups" />}
          {openedState.invites && <InviteLists key="invites" />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
