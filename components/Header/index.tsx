'use client'

import { useState, useContext } from 'react'
import { RiMenu4Fill } from 'react-icons/ri'
import { FaBell } from 'react-icons/fa'
import DropDown from '../dropdown'
import Tooltip from '../tootip'
import UserContext from '@/context/user.context'
import Image from '@/components/image'
import Badge from '@/components/badge'
import { getPhotoURL } from '@/components/utils/getPhotoURL'

export default function Header() {
  const { user } = useContext(UserContext)

  const [dropdownOpen, changeDropDown] = useState<boolean>(false)

  const handleMenuClick = (event: any) => {
    document.body.dispatchEvent(new CustomEvent('OPEN_MENU'))
  }

  return (
    <header className="bg-black2 rounded-md relative row-start-1 row-end-2 p-2 px-4 flex flex-row items-center justify-between">
      <div className="flex flex-row items-center">
        {user && (
          <button
            type="button"
            aria-label="Menu button"
            onClick={handleMenuClick}
            className="block md:hidden p-1 text-white2 hover:text-white1"
          >
            <RiMenu4Fill className="text-inherit w-6 h-6" />
          </button>
        )}

        <h1 className="flex flex-row items-center font-mono font-semibold text-lg text-white1">
          <Image
            src="/favicon.svg"
            alt="logo"
            className="w-6 h-6"
          />
          Chatsy
        </h1>
      </div>

      <div className="flex flex-row items-center gap-2">

        {/* Notification button */}
        {user &&
          <DropDown
            open={dropdownOpen}
            close={() => changeDropDown(false)}
            items={[
              <div
                key="no_notification"
                className="min-w-[200px] flex flex-row align-center | text-white2 text-sm p-1 | whitespace-nowrap"
              >
                No notifications!
              </div>,
            ]}
          >
            <Badge amount={0}>
              <Tooltip text="notifications" position="bottom">
                <button
                  type="button"
                  className="p-2 | text-white2 | hover:text-white hover:bg-midBlack2 | rounded-full"
                  onClick={() => changeDropDown(!dropdownOpen)}
                >
                  <FaBell className="text-inherit | w-4 h-4" />
                </button>
              </Tooltip>
            </Badge>
          </DropDown>
        }

        {user && (
          <Image
            src={getPhotoURL(user.photo)}
            alt="avatar"
            style={{ backgroundImage: "linear-gradient(to right, #2c5364, #203a43, #0f2027)" }}
            className="w-6 h-6 md:w-10 md:h-10 | rounded-full border-2 border-midBlack border-solid"
          />
        )}
      </div>
    </header>
  )
}
