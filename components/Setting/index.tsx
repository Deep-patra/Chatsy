import { useState, useEffect, useContext } from 'react'
import { IoSettingsOutline } from 'react-icons/io5'
import SideTabs from './sideTabs'
import Modal from '../Modal'
import Dropdown from './dropdown'
import EditProfile from './EditProfile'
import EditContacts from './editContacts'
import Auth from '@/context/auth.context'

export default function Setting() {
  const [isOpen, changeIsOpen] = useState<boolean>(false)

  const { user } = useContext(Auth)

  const handleOpenSetting = () => {
    changeIsOpen(true)
  }

  const onClose = () => {
    changeIsOpen(false)
  }

  // listen to the OPEN_SETTING event
  useEffect(() => {
    document.body.addEventListener('OPEN_SETTING', handleOpenSetting)

    return () => {
      document.body.removeEventListener('OPEN_SETTING', handleOpenSetting)
    }
  }, [])

  return (
    <Modal {...{ open: isOpen, onClose }}>
      <div className="setting-modal shadow-2xl flex flex-col p-2 md:px-3 rounded-md bg-black2">
        {/* Header */}
        <div className="py-2 mb-4 text-white1 flex flex-row items-center gap-2">
          <span className="text-md md:text-lg">
            <IoSettingsOutline className="w-5 h-5 text-inherit" />
          </span>
          <h4 className="text-md md:text-lg text-inherit">Settings</h4>
        </div>

        {user && (
          <>
            <div className="w-full h-full flex-col hidden md:flex">
              <SideTabs
                tabs={{
                  Profile: <EditProfile {...{ user }} />,
                  Contacts: <EditContacts {...{ user }} />,
                }}
              />
            </div>

            <div className="w-full decorate-scrollbar overflow-y-auto flex flex-col gap-2 md:hidden">
              <Dropdown text="Profile">
                <div className="w-full bg-black3 rounded-md">
                  <EditProfile {...{ user }} />
                </div>
              </Dropdown>

              <Dropdown text="Contacts">
                <div className="w-full bg-black3 rounded-md">
                  <EditContacts {...{ user }} />
                </div>
              </Dropdown>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
