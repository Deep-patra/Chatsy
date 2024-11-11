import { createContext } from 'react'
import { User } from '@/services/user'

export interface IUserContext {
  user: User | null
  setUser: (user: User) => void
}

const UserContext = createContext<IUserContext>({
  user: null,
  setUser: (user: User) => {},
})

export default UserContext
