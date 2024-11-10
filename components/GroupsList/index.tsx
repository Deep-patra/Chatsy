import { useState, useContext, useEffect, memo, useCallback } from 'react'
import classnames from 'classnames'
import { Group } from '@/services/group'
import { User } from '@/services/user'
import { FiPlus } from 'react-icons/fi'
import UserContext from '@/context/user.context'
import GroupContext from '@/context/group.context'
import ChatContext from '@/context/chat.context'
import Loader from '@/components/loader'
import log from '@/components/utils/log'
import { events } from '@/components/utils/events'
import Image from '../image'
import Empty from '@/components/empty'
import { getPhotoURL } from '../utils/getPhotoURL'

const Loading = memo(function loader() {
  return (
    <div className="flex flex-col items-center justify-center | w-full h-full flex-grow">
      <div className="relative w-10 h-10">
        <Loader color="white" />
      </div>
    </div>
  )
})


export default function GroupsList() {

  const { user } = useContext(UserContext)
  const { groups, setGroups } = useContext(GroupContext)
  const { activeChat, changeActiveChat } = useContext(ChatContext)

  const [loading, changeLoading] = useState<boolean>(false)

  const handleCreateGroup = useCallback(() => {
    document.body.dispatchEvent(new Event(events.open_create_group))
  }, [])

  const handleClick = useCallback((group: Group) => {
    changeActiveChat(group)
  }, [])


  useEffect(() => {

    const processGroups = async (user: User) => {
      if (groups.length === 0)
        changeLoading(true)

      const g = await Group.getAll(user.id)
        .catch(console.error)

      log("Groups: ", g)
      setGroups(g || [])

      changeLoading(false)
    }


    if (user)
      processGroups(user)
  }, [user])

  return (
    <div className="h-full w-full | flex flex-col gap-2">
      <span className="text-brightOrange | p-2">Groups</span>

      <div className="w-full | overflow-hidden">
        {
          (groups.length > 0 && !loading) && (
            <ul className="flex flex-col gap-1 | w-full">
              {
                groups.map((group, index) => (
                  <li 
                    key={index}
                    className={classnames("w-full | group | hover:bg-black2 | p-1", activeChat === group ? "!bg-coral text-white" : "" )}
                  >
                    <button
                      type="button"
                      className="w-full | flex flex-row items-center gap-2 | p-1"
                      onClick={() => { handleClick(group) }}
                    >
                      <Image
                        src={getPhotoURL(group.photo)}
                        alt={group.name}
                        className="w-8 h-8 | bg-white3 | rounded-full | border-2 border-white3 | group-hover:border-white2"
                      />

                      <span className="text-white1 text-sm | group-hover:text-white">{group.name}</span>
                    </button>
                  </li>
                ))
              }
            </ul>
          )
        }
      </div>

      {/* Loading */}
      {loading && (<Loading />)}

      {/* Empty */}
      {(!loading && groups.length == 0) && 
        <Empty>
          <span className="text-xs text-white2">no groups</span>
        </Empty>
      }

      <button
        type="button"
        className="mt-auto | flex flex-row items-center gap-2 | text-sm text-white | bg-brightBlue | p-2 | hover:rounded-md hover:scale-x-95 | transition-all duration-200"
        onClick={handleCreateGroup}
      >
        <span><FiPlus className="w-5 h-5 text-inherit" /></span>
        <span>Create</span>
      </button>
    </div>
  )
}
