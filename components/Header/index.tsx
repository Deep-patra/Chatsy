'use client'

import Image from 'next/image'
import { RiMenu4Fill } from 'react-icons/ri'
import { FaBell, FaRegBell } from 'react-icons/fa'
import Menu from '../menu'
import Tooltip from '../tootip'
import Auth from '@/context/auth.context'

export default function Header() {
  const handleMenuClick = (event: any) => {
    document.body.dispatchEvent(new CustomEvent('OPEN_MENU'))
  }

  const handleSearchClick = () => {
    document.body.dispatchEvent(new CustomEvent('OPEN_SEARCH'))
  }

  return (
    <Auth.Consumer>
      {({ user }) => (
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
              <div className="relative w-6 h-6">
                <Image src="/favicon.svg" alt="logo" fill />
              </div>
              Chatsy
            </h1>
          </div>

          <div className="flex flex-row items-center gap-2">
            {/* Search Button */}
            {/*user && (
              <Tooltip text="search">
                <button
                  className="text-white1 p-1 rounded-full hover:bg-black2"
                  onClick={handleSearchClick}
                >
                  <CiSearch className="text-inherit w-6 h-6" />
              </Tooltip>
                </button>
            ) */}

            {/* Notification button */}
            <Tooltip text="notifications" position="bottom">
              <button
                type="button"
                className="p-2 | text-white2 | hover:text-white hover:bg-midBlack2 | rounded-full"
              >
                <FaBell className="text-inherit | w-5 h-5" />
              </button>
            </Tooltip>

            {/* Profile Picture & Menu */}
            {user && <Menu {...{ user }} />}
          </div>
        </header>
      )}
    </Auth.Consumer>
  )
}
