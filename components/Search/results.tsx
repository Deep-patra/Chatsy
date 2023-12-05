import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { type IContact, IUser } from '@/context/auth.context'
import { BsPersonAdd } from 'react-icons/bs'
import Loader from '@/components/loader'

interface ISearchResultItem {
  uid: string
  photoURL: string
  name: string
}

interface ISearchResultItemProps extends ISearchResultItem {
  alreadyExists: (uid: string) => boolean
  addContact: (uid: string) => Promise<void>
}

interface ISearchResultsProps {
  contacts: IContact[]
  results: ISearchResultItem[]
  addContact: (uid: string) => Promise<void>
}

const SearchItem = ({
  uid,
  name,
  photoURL,
  alreadyExists,
  addContact,
}: ISearchResultItemProps) => {
  const [loading, changeLoading] = useState<boolean>(false)

  const handleAddContact = () => {
    changeLoading(true)

    addContact(uid).then(() => {
      changeLoading(false)
    })
  }
  return (
    <div className="group relative hover:bg-black3 transition-colors w-full flex flex-row items-center p-2 rounded-md gap-2">
      {/* Profile Picture */}
      <div className="relative rounded-full border border-solid border-white3 w-10 h-10 bg-gray1 overflow-hidden">
        <Image src={photoURL || '/user.png'} alt={name} fill />
      </div>

      {/* Name */}
      <span className="w-auto whitespace-nowrap text-ellipsis overflow-hidden text-white1">
        {name}
      </span>

      {/* Add Contact Button */}
      {!alreadyExists(uid) &&
        (!loading ? (
          <button
            type="button"
            aria-label="Add Contact button"
            title={`Add ${name} to Contacts`}
            className="ml-auto p-2 md:hidden md:group-hover:inline-block hover:bg-black3 rounded-full text-white2 hover:text-green"
            onClick={handleAddContact}
          >
            <BsPersonAdd className="w-6 h-6 text-inherit" />
          </button>
        ) : (
          <div className="w-5 h-5 ml-auto relative">
            <Loader color="white" />
          </div>
        ))}
    </div>
  )
}

export default function SearchResults({
  results,
  contacts,
  addContact,
}: ISearchResultsProps) {
  const alreadyExists = (uid: string): boolean => {
    const contact = contacts.find((value: IContact) => value.uid === uid)
    return contact ? true : false
  }

  return (
    <div className="decorate-scrollbar w-full h-full py-2 px-1">
      {results.map(({ uid, name, photoURL }, index) => (
        <SearchItem
          key={index}
          {...{ uid, name, photoURL, alreadyExists, addContact }}
        />
      ))}
    </div>
  )
}
