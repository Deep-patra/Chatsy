import {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
  memo,
} from 'react'
import { motion } from 'framer-motion'
import UserContext from '@/context/user.context'
import InviteContext, { I_Invites } from '@/context/invites.context'
import { CiSearch } from 'react-icons/ci'
import { RxCross2 } from 'react-icons/rx'
import { RiUserSearchLine } from 'react-icons/ri'
import { BiMailSend, BiConfused } from 'react-icons/bi'
import { User } from '@/services/user'
import Image from '@/components/image'
import Input from '@/components/input'
import Tooltip from '@/components/tootip'
import Loader from '@/components/loader'
import { getPhotoURL } from '@/components/utils/getPhotoURL'
import { InviteService } from '@/services/invites/service'

const Searching = memo(function searching() {
  return (
    <div className="w-full h-full flex-grow | flex flex-col items-center justify-center gap-2 | text-white1">
      <span className="w-10 h-10 | inline-block">
        <Loader color="white" />
      </span>
      <span className="text-xs text-inherit">searching...</span>
    </div>
  )
})

const NoResults = memo(function noResults() {
  return (
    <div className="w-full h-full flex-grow | flex flex-col items-center justify-center | text-white1">
      <span className="w-10 h-10 | p-1 | inline-Block">
        <BiConfused className="w-full h-full | text-inherit" />
      </span>
      <span className="text-xs text-inherit">no results found!</span>
    </div>
  )
})

// Check if the user is present in the contact list
const isAlreadyInContacts = (user: User, searchUser: User) => {
  if (user.contactIds.length === 0) return false

  const found = user.contactIds.find((item) => item.user_id === searchUser.id)

  if (found) true
  return false
}

// Check if the user is present in the invites list
const isAlreadyInInvites = (invites: I_Invites, searchUser: User): boolean => {
  let found = null

  found = invites.user.sent.find((item) => item.to === searchUser.id)
  found =
    found ?? invites.user.received.find((item) => item.from === searchUser.id)

  if (found) return true

  return false
}

export default function Search() {
  const { user } = useContext(UserContext)
  const { invites, refreshInvites } = useContext(InviteContext)

  const [loadingResults, changeLoadingResults] = useState<boolean>(false)
  const [loading, changeLoading] = useState<boolean>(false)
  const [value, changeValue] = useState<string>('')
  const [results, changeResults] = useState<User[]>([])

  const handleChange = useCallback((event: any) => {
    const target = event.target as HTMLInputElement
    changeValue(target.value)
  }, [])

  const checkSearchUser = useCallback(
    (searchUser: User) => {
      if (!user) false

      if (
        user!.id === searchUser.id ||
        isAlreadyInInvites(invites, searchUser) ||
        isAlreadyInContacts(user!, searchUser)
      )
        return true
      return false
    },
    [user, invites]
  )

  const handleSendInvite = useCallback(
    (searchUser: User) => {
      if (!user) return

      // change loading state
      changeLoading(true)

      InviteService.send(user.id, searchUser.id)
        .then(() => {
          refreshInvites(user.id)
        })
        .catch(console.error)
        .finally(() => {
          // change loading state
          changeLoading(false)
        })
    },
    [user]
  )

  useEffect(() => {
    let timeoutId: any

    if (value !== '')
      timeoutId = setTimeout(() => {
        changeLoadingResults(true)

        User.search(value)
          .then((values) => {
            changeResults(values)
          })
          .catch(console.error)
          .finally(() => {
            changeLoadingResults(false)
          })
      }, 1000)

    return () => {
      timeoutId && clearTimeout(timeoutId)
    }
  }, [value])

  return (
    <div className="flex flex-col gap-3 | h-full">
      <Input
        value={value}
        type="text"
        placeholder="search"
        onChange={handleChange}
        autoFocus={true}
        className="text-sm"
        primaryIcon={<CiSearch className="w-5 h-5 | text-sm | text-white3" />}
        secondaryBut={{
          onClick: () => changeValue(''),
        }}
        secondaryIcon={
          value !== '' ? (
            <RxCross2 className="w-4 h-4 text-inherit" />
          ) : undefined
        }
      />

      <div className="w-full h-full flex-grow | overflow-y-auto | decorate-scrollbar">
        {results.length > 0 && (
          <ul className="flex flex-col gap-2">
            {results.map((u, index) => (
              <motion.li
                key={index}
                className="group | flex flex-row items-center justify-between | p-1 | rounded-md | hover:bg-black2"
              >
                <div className="w-full | flex flex-row items-center gap-2">
                  <Image
                    src={getPhotoURL(u.photo)}
                    alt={u.name}
                    className="w-8 h-8 | border border-solid border-white2 | rounded-full | group-hover:border-brightGreen"
                  />

                  <span className="text-md text-white2 | group-hover:text-brightWhite">
                    {u.name}
                  </span>
                </div>

                {/* Send Invite Button */}
                {!checkSearchUser(u) && !loading && (
                  <Tooltip text="send invite" position="bottom">
                    <button
                      type="button"
                      className="group-hover:inline-block | hidden | text-brightGreen"
                      onClick={() => {
                        handleSendInvite(u)
                      }}
                    >
                      <BiMailSend className="w-5 h-5 text-inherit" />
                    </button>
                  </Tooltip>
                )}

                {/* Loading */}
                {loading && (
                  <div className="w-10 h-10 | relative">
                    <Loader color="white" />
                  </div>
                )}
              </motion.li>
            ))}
          </ul>
        )}

        {/* loading search results */}
        {loadingResults && <Searching />}

        {/* no search results */}
        {!loadingResults && results.length === 0 && value !== '' && (
          <NoResults />
        )}

        {/* when the input value is "" */}
        {value === '' && (
          <div className="w-full h-full flex-grow | flex flex-col items-center justify-center gap-1 | text-white1">
            <span className="w-10 h-10 | p-1 | text-inherit">
              <RiUserSearchLine className="w-full h-full | text-inherit" />
            </span>
            <span className="text-xs text-white2">
              {' '}
              search for an username{' '}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
