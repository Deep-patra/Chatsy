import {
  useState,
  useEffect,
  useContext,
  useCallback,
  memo,
  useMemo,
} from 'react'
import classnames from 'classnames'
import { GiCube } from 'react-icons/gi'
import ContactContext from '@/context/contact.context'
import UserContext from '@/context/user.context'
import ChatContext from '@/context/chat.context'
import { Contact } from '@/services/contact'
import { User } from '@/services/user'
import log from '@/components/utils/log'
import Loader from '@/components/loader'
import Image from '../image'
import Empty from '@/components/empty'
import { getPhotoURL } from '../utils/getPhotoURL'

const Loading = memo(function loading() {
  return (
    <>
      {/* Loading */}
      <div className="w-full h-full flex-grow | flex flex-col items-center justify-center">
        <div className="w-10 h-10 relative">
          <Loader color="white" />
        </div>
      </div>
    </>
  )
})

export default function ContactsList() {
  const { user } = useContext(UserContext)
  const { contacts, setContacts } = useContext(ContactContext)
  const { activeChat, changeActiveChat } = useContext(ChatContext)

  const [loading, changeLoading] = useState<boolean>(false)

  const handleClick = useCallback((contact: Contact) => {
    changeActiveChat(contact)
  }, [])

  useEffect(() => {
    // fetch the contacts when the component is mounted
    // and store them in the context
    const processContacts = async (user: User) => {
      if (contacts.length === 0) changeLoading(true)

      const results = await Contact.getAll(user.id).catch(console.error)

      log('Contacts: ', results)
      setContacts(results || [])

      changeLoading(false)
    }

    if (user) processContacts(user)
  }, [user])

  return (
    <div className="w-full h-full flex-grow | flex flex-col gap-2">
      <span className="text-brightGreen | p-2">Contacts</span>

      {/* Contact List */}
      {contacts.length > 0 && (
        <div className="h-full">
          <ul>
            {contacts.map((contact, index) => (
              <li
                key={index}
                className={classnames(
                  'flex flex-row items-center justify-between | group | hover:bg-black3 | p-1 | transition-colors duration-200',
                  {
                    '!bg-brightGreen':
                      activeChat && contact.id === activeChat.id,
                  }
                )}
              >
                <button
                  type="button"
                  className="flex flex-row items-center gap-2 justify-start"
                  onClick={() => handleClick(contact)}
                >
                  <Image
                    src={getPhotoURL(contact.photo)}
                    alt={contact.name}
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, #2c5364, #203a43, #0f2027)',
                    }}
                    className="w-10 h-10 | rounded-full | border-2 border-solid border-white3 group-hover:border-white2"
                  />

                  <span
                    className={classnames(
                      'text-sm text-white2 text-ellipsis overflow-hidden | group-hover:text-white1',
                      {
                        '!text-midBlack2':
                          activeChat && contact.id === activeChat.id,
                      }
                    )}
                  >
                    {contact.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading && <Loading />}

      {!loading && contacts.length == 0 && (
        <Empty>
          <span className="text-xs text-whtie2">no contacts</span>
        </Empty>
      )}
    </div>
  )
}
