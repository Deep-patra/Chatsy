import { useState, useContext } from 'react'
import Image from 'next/image'
import { RiContactsFill } from 'react-icons/ri'
import { BsChatRightText } from 'react-icons/bs'
import { IoMdAdd } from 'react-icons/io'
import { RxCross2 } from 'react-icons/rx'
import { motion } from 'framer-motion'
import AddContacts from './addContacts'

interface IContactItem {
  name: string
  uid: string
  photoURL: string
}

interface IContactsProps {
  contacts: IContactItem[]
  handleOpenChat: (uid: string) => void
}

export default function Contacts(props: IContactsProps) {
  const [open, toggle] = useState<boolean>(false)

  return (
    <div className="py-2">
      <div className="p-1 flex flex-row items-center justify-between text-white2 cursor-pointer">
        <div className="flex flex-row items-center gap-3">
          <RiContactsFill className="w-5 h-5 text-inherit" />
          <span className="text-lg font-semibold">Contacts</span>
        </div>

        <motion.button
          type="button"
          aria-label="Add contact button"
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full hover:bg-black3"
          onClick={() => {
            toggle(!open)
          }}
        >
          {open ? (
            <RxCross2 className="w-5 h-5 text-warning" />
          ) : (
            <IoMdAdd className="w-5 h-5 text-white1" />
          )}
        </motion.button>
      </div>

      <AddContacts open={open} />

      <ul className="flex flex-col gap-2 py-2">
        {props.contacts.length < 1 && (
          <div className="h-48 text-white3 flex flex-col items-center justify-center gap-2">
            <BsChatRightText className="w-5 h-5 text-inherit" />
            <span className="text-base">Add Contacts to Chat</span>
          </div>
        )}

        {props.contacts.length > 0
          ? props.contacts.map((item, idx) => (
              <li key={idx} className="w-full">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  aria-label={item.name}
                  className="w-full p-2 flex flex-row items-center gap-2 rounded-md text-white2 hover:bg-black3 hover:text-white1"
                  onClick={() => {
                    props.handleOpenChat(item.uid)
                  }}
                >
                  <div className="relative flex-shrink-0 rounded-full w-5 h-5 md:w-8 md:h-8 bg-gray-500 overflow-hidden">
                    <Image
                      src={item.photoURL || '/user.png'}
                      alt={''}
                      fill
                      className="rounded-full"
                    />
                  </div>

                  <span className="text-start text-inherit inline-block w-40 whitespace-nowrap text-ellipsis overflow-hidden">
                    {item.name}
                  </span>
                </motion.button>
              </li>
            ))
          : null}
      </ul>
    </div>
  )
}
