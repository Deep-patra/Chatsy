import { useState, useEffect } from 'react'
import { User } from '@/services/user'
import { type IUserContext } from '@/context/user.context'

export const useGetUser = (): IUserContext => {
  const [_user, changeUser] = useState<User | null>(null)

  const setUser = (user: User) => {
    changeUser(user)
  }

  return { user: _user, setUser }
}
