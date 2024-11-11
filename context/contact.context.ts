import { createContext } from 'react'
import { Contact } from '@/services/contact'

export interface IContactContext {
  contacts: Contact[]
  setContacts: (contacts: Contact[]) => void
  updateContact: (contact: Contact) => void
}

const ContactContext = createContext<IContactContext>({
  contacts: [],
  setContacts: (contacts: Contact[]) => {},
  updateContact: (contact: Contact) => {},
})

export default ContactContext
