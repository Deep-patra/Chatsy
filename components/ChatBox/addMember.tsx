import {
  useState,
  useContext,
  useMemo,
  useCallback,
  useEffect,
  memo,
} from 'react'
import UserContext from '@/context/user.context'
import ContactContext from '@/context/contact.context'
import ChatContext from '@/context/chat.context'
import Image from '@/components/image'
import Modal from '@/components/Modal'
import LoadingButton from '@/components/loadingButton'
import { FiPlus } from 'react-icons/fi'
import { BiConfused } from 'react-icons/bi'
import { Group } from '@/services/group'
import { events } from '../utils/events'
import { getPhotoURL } from '../utils/getPhotoURL'
import { dispatchSnackbarEvent } from '../utils/dispatchEvent'
import { Contact } from '@/services/contact'

const NoContacts = memo(function noContacts() {
  return (
    <li className="flex flex-col items-center gap-2 | p-1 | text-white2">
      <BiConfused className="w-10 h-10 text-inherit" />
      <span className="text-xs">no contacts to add !</span>
    </li>
  )
})

export default function AddMember() {
  const { user } = useContext(UserContext)
  const { activeChat } = useContext(ChatContext)
  const { contacts } = useContext(ContactContext)

  const [isOpen, changeIsOpen] = useState<boolean>(false)

  // list of contacts which are not in the members list of the group
  const contactsNotMember = useMemo(() => {
    if (activeChat instanceof Group && contacts.length > 0) {
      const new_contacts = contacts.filter((contact) => {
        if (activeChat.memberIds.find((value) => value === contact.id)) return

        return contact
      })

      return new_contacts
    }

    return []
  }, [activeChat, contacts])

  const handleAdd = useCallback(
    (contact: Contact) => {
      return (changeLoading: (ns: boolean) => void) => {
        if (activeChat instanceof Group && user) {
          // show loading state
          changeLoading(true)

          activeChat
            .sendInvite(user.id, contact.id)
            .then(() => {
              // show a snackbar
              dispatchSnackbarEvent({
                type: 'success',
                text: `Sent ${contact.name} an invite`,
              })
            })
            .catch(console.error)
            .finally(() => {
              changeLoading(false)
            })
        }
      }
    },
    [activeChat, user]
  )

  useEffect(() => {
    const handleAddMember = () => changeIsOpen(true)

    document.body.addEventListener(events.open_add_member, handleAddMember)

    return () =>
      document.body.removeEventListener(events.open_add_member, handleAddMember)
  }, [])

  return (
    <Modal
      className="w-[300px] max-h-[400px] | flex flex-col gap-3 | bg-black3 | p-2 rounded-md"
      {...{
        open: isOpen,
        onClose: () => {
          changeIsOpen(false)
        },
      }}
    >
      <>
        <span className="text-sm text-white">Add members</span>

        {/* list of the contacts */}
        <ul className="flex flex-col gap-1 | overflow-y-auto | decorate-scrollbar">
          {contactsNotMember.length > 0 &&
            contactsNotMember.map((contact) => (
              <li
                key={contact.id}
                className="relative | p-1 | flex flex-row items-center gap-2 | group hover:bg-black2 | rounded-md | hover:px-3 | transition-all | duration-200"
              >
                <Image
                  src={getPhotoURL(contact.photo)}
                  className="w-10 h-10 | rounded-full | border-2 border-white3 | group-hover:border-white1"
                />
                <span className="max-w-[70%] | overflow-hidden | text-ellipsis text-sm text-white2 | group-hover:text-white">
                  {contact.name}
                </span>
                <LoadingButton
                  type="button"
                  className="group-hover:flex flex-row items-center gap-1 | hidden | ml-auto p-1 px-2 | text-xs text-white | bg-brightPurple | rounded-md | hover:scale-95 | transition-transform"
                  onclick={handleAdd(contact)}
                >
                  <FiPlus className="w-5 h-5 text-inherit" />
                  <span className="text-xs text-inherit">add</span>
                </LoadingButton>
              </li>
            ))}

          {/* No Contacts */}
          {contactsNotMember.length === 0 && <NoContacts />}
        </ul>
      </>
    </Modal>
  )
}
