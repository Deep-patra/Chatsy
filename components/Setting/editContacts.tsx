import { useState, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import classnames from 'classnames'
import { FaRegEdit } from 'react-icons/fa'
import { RxCross1 } from 'react-icons/rx'
import { MdDeleteOutline } from 'react-icons/md'
import Tooltip from '../tootip'
import Modal from '../Modal'
import Loader from '../loader'
import UserService from '@/services/user.service'
import { type IUser } from '@/context/auth.context'

interface IEditContactsProps {
  user: IUser
}

type ContactsState = {
  uid: string
  name: string
  photoURL: string
  selected: boolean
}

const ContactItem = ({
  uid,
  name,
  photoURL,
  selected,
  edit,
  onChange,
}: ContactsState & { edit: boolean; onChange: (uid: string) => void }) => {
  return (
    <motion.li whileTap={{ scale: 0.95 }}>
      <button
        className={classnames(
          'w-full flex flex-row items-center gap-2 p-2 rounded-md transition-colors',
          {
            'bg-gray1': selected,
          }
        )}
        onClick={() => {
          onChange(uid)
        }}
      >
        {/* Radio */}
        <AnimatePresence>
          {edit && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={classnames(
                'w-4 h-4 flex-shrink-0 rounded-full border border-solid border-white1 transition-colors',
                { 'bg-white1': selected }
              )}
            ></motion.div>
          )}
        </AnimatePresence>

        {/* Profile */}
        <div className="flex flex-row items-center gap-2 w-min">
          <div className="flex-shrink-0 w-8 h-8 overflow-hidden rounded-full relative">
            <Image src={photoURL || '/user.png'} alt={name} fill />
          </div>

          <span className="text-white1 sm md:text-md flex-grow-0 overflow-hidden w-full overflow-ellipsis whitespace-nowrap">
            {name}
          </span>
        </div>
      </button>
    </motion.li>
  )
}

export default function EditContacts({ user }: IEditContactsProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [edit, changeEdit] = useState<boolean>(false)
  const [contacts, changeContacts] = useState<ContactsState[]>([])
  const [openConfirmModal, changeOpenConfirmModal] = useState<boolean>(false)

  const initializeContacts = () => {
    const _contacts: ContactsState[] = []

    user.contacts.forEach((value) => {
      _contacts.push({
        uid: value.uid,
        name: value.name,
        photoURL: value.photoURL,
        selected: false,
      })
    })

    // set the contacts
    changeContacts(_contacts)
  }

  const handleEdit = () => {
    // reset the contact value
    if (edit) initializeContacts()

    changeEdit(!edit)
  }

  const handleDelete = async () => {
    // show the loading status
    setLoading(true)

    const contactIds: string[] = []

    contacts.forEach((value) => {
      if (value.selected) contactIds.push(value.uid)
    })

    await UserService.removeContact(user.uid, contactIds).finally(() => {
      setLoading(false)

      // close the modal
      changeOpenConfirmModal(false)
    })
  }

  const handleChange = (uid: string) => {
    const updatedContacts = contacts.map((value) => {
      if (value.uid === uid) value.selected = !value.selected
      return value
    })

    changeContacts(updatedContacts)
  }

  useEffect(() => {
    initializeContacts()
  }, [user])

  // reset values on unmount
  useEffect(() => {
    return () => {
      // edit mode to false
      changeEdit(false)
    }
  }, [])

  return (
    <div className="flex flex-col">
      {/* Sticky header */}
      <div className="sticky p-2 top-0 left-0 w-full">
        <div className="p-1 px-2 bg-black2 md:bg-black3 rounded-md flex flex-row items-center justify-between gap-2">
          <span className="text-white1 text-md">Edit</span>

          <div className="flex flex-row items-center gap-2">
            {/* Edit Button */}
            <Tooltip text={!edit ? 'Edit' : 'Cancel'}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={classnames('p-1 rounded-full transition-colors', {
                  'bg-black3': edit,
                  'bg-blue text-white1': !edit,
                })}
                onClick={handleEdit}
              >
                {!edit && <FaRegEdit className="w-4 h-4 text-inherit" />}
                {edit && <RxCross1 className="w-4 h-4 text-warning" />}
              </motion.button>
            </Tooltip>

            {/* Delete Button */}
            <Tooltip text="Delete">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={classnames('p-1 rounded-full ', {
                  'cursor-not-allowed text-white3 bg-black3': !edit,
                  'bg-warning text-white1': edit,
                })}
                onClick={() => {
                  changeOpenConfirmModal(true)
                }}
              >
                <MdDeleteOutline className="w-4 h-4 text-inherit" />
              </motion.button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Contacts list */}
      <ul className="flex flex-col w-full decorate-scroll">
        {/* No Contacts Placeholder */}
        {contacts.length === 0 && (
          <div className="py-4 w-full flex flex-row items-center justify-center">
            <span className="text-white3 text-sm">No Contacts !!!</span>
          </div>
        )}

        {contacts.length > 0 &&
          contacts.map((value) => (
            <ContactItem
              key={value.uid}
              {...{ ...value, edit, onChange: handleChange }}
            />
          ))}
      </ul>

      {/* Delete Confirm Modal */}
      <Modal
        {...{
          open: openConfirmModal,
          onClose: () => {
            // only close, when loading is false
            if (!loading) changeOpenConfirmModal(false)
          },
        }}
      >
        <>
          {!loading && (
            <div className="p-2 bg-black3 rounded-md flex flex-col gap-2">
              <span className="text-white2 text-sm">
                Delete selected contacts ?
              </span>

              {/* Confirm */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="ml-auto bg-green text-white1 text-sm md:text-md rounded-md py-1 px-2"
                onClick={handleDelete}
              >
                Confirm
              </motion.button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="w-20 h-20 bg-black3 rounded-md flex flex-row items-center justify-center">
              <Loader color="#fff" />
            </div>
          )}
        </>
      </Modal>
    </div>
  )
}
