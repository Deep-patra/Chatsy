import { createContext } from 'react'
import { User } from 'firebase/auth'

export interface IContact {
  name: string;
  photoURL: string;
  uid: string;
  messageGroupId: string;
}

export interface IUser {
  name: string | null | undefined;
  photoURL: string | null | undefined;
  email: string | null | undefined;
  uid: string;
  contacts: IContact[];
}

interface IAuthContext {
  user: IUser | null;
  setUser: (user: User) => void;
  setContact: (contacts: IContact[]) => void;
  changeUser: (user: IUser) => void;
}

const Auth = createContext<IAuthContext>({
  user: null,
  setUser(user: User) {},
  setContact(contacts: IContact[]) {},
  changeUser(user: IUser) {},
})

export default Auth