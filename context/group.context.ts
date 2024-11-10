import { createContext } from 'react'
import { Group } from '@/services/group'

export interface IGroupContext {
  groups: Group[]
  setGroups: (groups: Group[]) => void
  updateGroup: (groups: Group) => void
}

const GroupContext = createContext<IGroupContext>({
  groups: [],
  setGroups: (groups: Group[]) => {},
  updateGroup: (group: Group) => {}
})

export default GroupContext

