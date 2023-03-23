'use client'

import Image from 'next/image'
import { RiMenu4Fill } from 'react-icons/ri'
import Menu from '../menu'
import Auth from '@/context/auth.context'

export default function Header() {
  const handleMenuClick = (event: any) => {
    document.body.dispatchEvent(new CustomEvent('OPEN_MENU'))
  }

  return (
    <Auth.Consumer>
      {({ user }) => (
        <header
          style={{ gridRowStart: 1, gridRowEnd: 2 }}
          className="relative p-2 px-4 flex flex-row items-center justify-between"
        >
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
              <div className="relative w-8 h-8">
                <Image src="/favicon.svg" alt="logo" fill />
              </div>
              Chatsy
            </h1>
          </div>

          {user && <Menu {...{ user }} />}
        </header>
      )}
    </Auth.Consumer>
  )
}
