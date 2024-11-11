import { createContext } from 'react'
import { Invite, GroupInvite } from '@/services/invites'

export interface I_Invites {
  user: {
    sent: Invite[]
    received: Invite[]
  }

  group: {
    sent: GroupInvite[]
    received: GroupInvite[]
  }
}

export interface IInviteContext {
  invites: I_Invites
  setInvites: (invite: I_Invites) => void
  refreshInvites: (user_id: string) => void
}

const InviteContext = createContext<IInviteContext>({
  invites: {
    user: { sent: [], received: [] },
    group: { sent: [], received: [] },
  },
  setInvites: (invites: I_Invites) => {},
  refreshInvites: (user_id: string) => {},
})

export default InviteContext
