import { useState } from 'react'
import { Group } from '@/services/group'
import { type IGroupContext } from '@/context/group.context'

export const useGetGroups = (): IGroupContext => {
  const [groups, changeGroups] = useState<Group[]>([])

  const setGroups = (groups: Group[]) => {
    changeGroups(groups)
  }

  const updateGroup = (group: Group) => {
    let found = false
    const new_groups = []

    for (const g of groups) {
      if (group.id !== g.id) {
        new_groups.push(group)
        continue
      }

      found = true
      new_groups.push(group)
    }

    if (!found) new_groups.push(group)
    changeGroups(new_groups)
  }

  return { groups, setGroups, updateGroup }
}
