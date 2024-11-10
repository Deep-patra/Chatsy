import { useState, useEffect } from 'react'
import { Contact } from '@/services/contact'
import { type IContactContext } from '@/context/contact.context'


export const useGetContacts = (): IContactContext => {
  const [contacts, changeContacts] = useState<Contact[]>([])
 
  const setContacts = (contacts: Contact[]) => {
    changeContacts(contacts)
  }

  const updateContact = (contact: Contact) => {
    const new_contacts = []

    let found = false
    for (const c of contacts) {

      if (contact.id !== c.id) {
        new_contacts.push(c)
        continue;  
      }

      found = true
      new_contacts.push(contact)
    }

    if (!found) new_contacts.push(contact)
    changeContacts(new_contacts)
  }

  return {  contacts, setContacts, updateContact }
}
