import { useEffect, useState } from 'react'
import Image from 'next/image'
import { FaRegUser } from 'react-icons/fa'
import Modal from '../Modal'
import Loader from '../loader'
import { IContact, type IUser } from '@/context/auth.context'
import User from '@/services/user.service'
import Contact from '@/services/contact.service'

export default function Profile() {
  const [isOpen, changeIsOpen] = useState<boolean>(false)
  const [user, changeUser] = useState<any | null>(null)

  const handleOpenProfile = async (event: Event) => {
    const { uid } = (event as any).detail as { uid: string }

    const [_user, contacts] = await Promise.all([
      User.read(uid),
      Contact.getAll(uid),
    ]).then((res) => {
      return res
    })

    changeUser({ ..._user, contacts })

    changeIsOpen(true)
  }

  const onClose = () => {
    changeIsOpen(false)

    // reset the values
    changeUser(null)
  }

  useEffect(() => {
    document.body.addEventListener('OPEN_PROFILE', handleOpenProfile)
    return () => {
      document.body.removeEventListener('OPEN_PROFILE', handleOpenProfile)
    }
  }, [])

  return (
    <Modal {...{ open: isOpen, onClose }}>
      <div className="profile-modal flex flex-col p-1 md:p-2 bg-black2 shadow-2xl rounded-md">
        {/* Header */}
        <div className="py-1 px-2 md:px-1 mb-4 flex flex-row gap-2 items-center">
          <span>
            <FaRegUser className="w-4 h-4 text-white1" />
          </span>
          <h4 className="text-md md:text-lg text-white1">Profile</h4>
        </div>

        {/* Loader */}
        {!user && (
          <div className="w-full h-full flex flex-row items-center justify-center">
            <div className="w-20 h-20">
              <Loader color="#FFF" />
            </div>
          </div>
        )}

        {user && (
          <div className="flex flex-col items-center md:items-stretch md:flex-row gap-1 overflow-y-auto md:overflow-hidden relative w-full h-full">
            {/* Profile Picture, Name and Email */}
            <div className="relative p-4 h-full flex flex-col gap-5 items-center justify-between">
              <div className="relative w-48 h-48 p-2 border-2 border-solid border-black1 rounded-full overflow-hidden">
                <Image
                  src={user.photoURL || '/user.png'}
                  alt={user.name || ''}
                  fill
                  objectFit="cover"
                />
              </div>

              <div className="flex flex-col gap-1 text-white1 p-3 rounded-md bg-black3">
                <div className="flex flex-row items-center justify-between gap-2 text-md">
                  <span className="text-white2">Name</span>
                  <span>{user.name}</span>
                </div>

                <div className="flex flex-row items-center justify-between gap-2 text-md">
                  <span className="text-white2">Email</span>
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div className="w-full md:w-1/2 p-4 flex">
              <div className="w-full h-full p-2 flex flex-col gap-2 rounded-md bg-black3 md:overflow-hidden">
                <span className="text-md text-white2 mb-2">Contacts</span>

                <ul className="flex flex-col w-full overflow-y-auto decorate-scrollbar">
                  {user.contacts.length === 0 && (
                    <li className="flex flex-row items-center justify-center">
                      <span className="text-white2 text-sm">No contacts !</span>
                    </li>
                  )}

                  {user.contacts.map((value: IContact, index: number) => (
                    <li
                      key={index}
                      className="relative flex flex-row items-center gap-2"
                    >
                      <div className="w-8 h-8 flex-shrink-0 relative overflow-hidden rounded-full">
                        <Image
                          src={value.photoURL || '/user.png'}
                          alt={value.name || ''}
                          fill
                        />
                      </div>

                      <span className="text-sm text-white1 overflow-hidden overflow-ellipsis w-full whitespace-nowrap">
                        {value.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
