import { useState } from 'react'
import { Invite, GroupInvite } from '@/services/invites'
import { type IInviteContext, type I_Invites } from '@/context/invites.context'

const initial: I_Invites = {
  user: {
    sent: [],
    received: [],
  },

  group: {
    sent: [],
    received: [],
  },
}

export const useGetInvites = (): IInviteContext => {
  const [invites, changeInvites] = useState<I_Invites>(initial)

  const setInvites = (invites: I_Invites) => {
    changeInvites(invites)
  }

  const refreshInvites = async (user_id: string) => {
    const user_invites = await Invite.getAll(user_id).catch((error) =>
      console.error(`ERROR in refreshInvites(${user_id})`, error)
    )

    const group_invites = await GroupInvite.getAll(user_id).catch((error) =>
      console.error(`ERROR in refreshInvites(${user_id}) | groupInvites`, error)
    )

    if (user_invites && group_invites)
      changeInvites({ user: user_invites, group: group_invites })
  }

  return { invites, setInvites, refreshInvites }
}
