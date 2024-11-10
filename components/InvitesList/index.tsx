import { useState, useContext, useEffect, useMemo, useCallback, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import classnames from 'classnames'
import Loading from '@/components/loader'
import Image from '@/components/image'
import UserContext from '@/context/user.context'
import InviteContext from '@/context/invites.context'
import { User } from '@/services/user'
import { Invite, GroupInvite } from "@/services/invites"
import log from '@/components/utils/log'
import Empty from '@/components/empty'
import type { InviteDisplayInfo, InviteInterface } from '@/services'
import type { I_Invites } from '@/context/invites.context'
import { getPhotoURL } from '../utils/getPhotoURL'

type InviteType = "send" | "received"

interface InviteGroupProps {
  label: string
  type: InviteType
  user: User
  invites: InviteInterface[]
}

const getInviteData = async (user_id: string, invite: InviteInterface): Promise<InviteDisplayInfo> => {
  const data = await invite.getDisplayInfo(user_id)
  return data
}

const InviteGroupItem = ({ invite, user, type }: { user: User, invite: InviteInterface , type: InviteType }) => {

  const { refreshInvites } = useContext(InviteContext)

  const [inviteDisplay, changeInviteDisplay] = useState<InviteDisplayInfo | null>(null)
  const [loading, changeLoading] = useState<boolean>(false)


  const handleClick = useCallback(() => {
    if (type === "send") 
      invite.cancel(user.id)
        .then(() => { refreshInvites(user.id) })
        .catch(console.error)
    else 
      invite.accept(user.id)
        .then(() => { refreshInvites(user.id) })
        .catch(console.error)
  }, [type])

  const fallback = useMemo(() => {
    return <li className="w-full h-[50px] | rounded-md | "></li>
  }, [])


  useEffect(() => {
    const getDisplayData = async () => {
      changeLoading(true)
      const result = await getInviteData(user.id, invite)
        .catch(console.error)

      if (result)
        changeInviteDisplay(result)

      changeLoading(false)
    }

    getDisplayData()
  }, [])

  return (
    <>
      <Suspense fallback={fallback}>
        {( !loading && inviteDisplay ) && (
          <motion.li
            layout
            exit={{ height: 0, opacity: 0 }}
            className="group | w-full | rounded-md | p-2 | flex flex-col gap-2 | hover:bg-black2">
            <div className="w-full | flex flex-row items-center gap-2">
              <Image
                src={getPhotoURL(inviteDisplay.photo)}
                className="w-8 h-8 | rounded-full | border border-white3"
              />

              <span className="text-sm text-white2">{inviteDisplay.name}</span>
            </div>

            <div className="group-hover:block hidden | w-full">
              <button
                className={classnames("w-full | border border-white3 | rounded-md hover:rounded-none | text-white | transition-all", type === "send" ? "bg-red-500" : "bg-brightGreen")}
                onClick={handleClick}
              >
                {type === "send" ? "cancel" : "accept"}
              </button>
            </div>
          </motion.li>
        )}
      </Suspense>
    </>
  )
}


const InviteGroup = ({ label, user, invites, type }: InviteGroupProps) => {
  
  if (invites.length === 0)
    return <></>

  return (
    <>
      <span className="text-sm text-white2 | bg-black2 | p-1 px-2 | rounded-md" >{label}</span>
      <ul className="flex flex-col gap-1">
        {invites.map((invite) => (
          <InviteGroupItem key={invite.id} {...{invite, user, type}} />
        ))}
      </ul>
    </>
  )
}


export default function InvitesList() {
  const { user } = useContext(UserContext)
  const { invites, setInvites } = useContext(InviteContext)

  const [loading, changeLoading] = useState<boolean>(false)


  const getTotalInvites = useMemo(() => {
    return invites.user.sent.length + invites.user.received.length + 
      invites.group.sent.length + invites.group.received.length
  }, [invites])

  useEffect(() => {
    const fetchInvites = async (user: User) => {
      const user_invites = await Invite.getAll(user.id)
      const group_invites = await GroupInvite.getAll(user.id)
    
      log('User: ', user_invites)
      log('Group: ', group_invites)

      setInvites({ user: user_invites, group: group_invites })
    }


    if (user) {
      // show the loading icon
      changeLoading(true)

      fetchInvites(user)
        .catch(console.error)
        .finally(() => {
          changeLoading(false)
        })
    }
  }, [user])

  return (
    <div className="w-full h-full | flex flex-col gap-1 | p-2">
      <span className="text-brightPurple">Invites</span>

      {(!loading && getTotalInvites !== 0 && user ) && (
        <div className="flex flex-col gap-2 | h-full">
          <InviteGroup
            label="Received"
            type="received"
            user={user}
            invites={invites.user.received.concat(invites.group.received)}
          />          
          <InviteGroup
            label="sent"
            type="send"
            user={user}
            invites={invites.user.sent.concat(invites.group.sent)}
          />
        </div>
      )}


      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center | w-full h-full flex-grow">
          <div className="relative w-10 h-10">
            <Loading color="white"/>
          </div>
        </div>
      )}

      {/* Empty Invites */}
      {(!loading && getTotalInvites === 0) && 
        <Empty>
          <span className="text-xs text-white2">no invites</span>
        </Empty>
      }
    </div>
  )
}
