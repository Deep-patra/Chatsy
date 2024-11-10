import { useRef, useCallback, useContext, useState, memo } from 'react'
import { FaRegEdit, FaRegSave } from 'react-icons/fa'
import { IoSettingsOutline } from 'react-icons/io5'
import Switch from '@/components/switch'
import Avatar from '@/components/CreateAvatar'
import UserContext from '@/context/user.context'
import { getPhotoURL } from '@/components/utils/getPhotoURL'
import { fetchUserAvatar } from '@/components/utils/fetchAvatar'
import { dispatchSnackbarEvent } from '@/components/utils/dispatchEvent'

interface IEditButtonProps {
  edit: boolean
  handleEdit: () => void
}


const EditButton = memo(function editButton({ edit, handleEdit }: IEditButtonProps) {
  return (
      <button
        type="button"
        data-edit={edit}
        className="flex flex-row items-center justify-between gap-1 | p-1 px-2 bg-black3 | rounded-md | text-white1 | data-[edit=true]:bg-brightGreen data-[edit=true]:text-black1"
        onClick={handleEdit}
      >
        {!edit && (
          <>
            <FaRegEdit className="w-4 h-4 text-inherit" />
            <span className="text-xs text-inherit">Edit</span>
          </>
        )}

        {edit && (
          <>
            <FaRegSave className="w-4 h-4 text-inherit" />
            <span className="text-xs text-inherit">Save</span>
          </>
        )}
      </button>
  )
})


export default function Settings() {
  const { user } = useContext(UserContext)

  const [enableNotifications, changeEnableNotifications] = useState<boolean>(false)
  const [username, changeUsername] = useState<string>(user!.name)
  const [description, changeDescription] = useState<string>(user!.description)
  const [photo, changePhoto] = useState<string>(getPhotoURL(user!.photo))
  const [file, changeFile] = useState<File | null>(null)

  const [editName, changeEditName] = useState<boolean>(false)
  const [editDescription, changeEditDescription] = useState<boolean>(false)
  const [editProfilePicture, changeEditProfilePicture] = useState<boolean>(false)


  const inputRef = useRef<HTMLInputElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const handleEditName = useCallback(() => {
    if (editName && username !== user!.name) {
      user!.update({ name: username })
           .then(() => { 
            // notify the user 
            dispatchSnackbarEvent({ text: 'username is updated', type: 'success' })
          })
           .catch(() => { 
            dispatchSnackbarEvent({ text: 'an error occurred', type: 'error' })
          })
           .finally(() => { changeEditName(false) })

    } else {
      changeEditName(true)

      // focus on the input element
      inputRef.current && inputRef.current.focus()
    }
  }, [username, editName])




  const handleEditDescription = useCallback(() => {
    if (editDescription && user!.description !== description) {
      
      user!.update({ description })
          .then(() => {
            // notify the user 
            dispatchSnackbarEvent({ text: 'Description is updated', type: 'success' })
          })
          .catch(() => {
            dispatchSnackbarEvent({ text: 'An error occurred', type: 'error' })

          })
          .finally(() => { changeEditDescription(false) })

    } else 
      changeEditDescription(true)
  }, [description, editDescription])




  const handleEditProfilePicture = useCallback(() => {
    if (editProfilePicture && (file || photo !== getPhotoURL(user!.photo))) {
      user!.update({ photo: file ?? photo })
           .then(() => {
            // notify the user
            dispatchSnackbarEvent({ text: 'Photo is updated', type: 'success' })
          })
           .catch(() => {
            dispatchSnackbarEvent({ text: 'An error occurred', type: 'error' })
          })
           .finally(() => { changeEditProfilePicture(false) }) 
    } else 
      changeEditProfilePicture(true)

  }, [photo, editProfilePicture])




  const refreshAvatar = useCallback(() => {
    fetchUserAvatar(username)
      .then(res => {
        if (res)
          changePhoto(res)
      })
      .catch(console.error)
  }, [username])


  return (
    <div className="relative | flex flex-col gap-1 | w-full h-full">
      <span
        className="flex flex-row items-center gap-2 | p-2 | text-white1"
      >
        <IoSettingsOutline className="w-6 h-6 text-inherit" />
        <p className="text-xl text-inherit">Settings</p>
      </span>

      <main className="w-full h-full | flex flex-col gap-3 | p-2 | overflow-y-auto | decorate-scrollbar">
      
      {/* Profile Settings */}
      <div className="flex flex-col gap-3 | w-full | p-1 | border-t border-t-white3">
  
        <div className="flex flex-col justify-start | text-gray2">
          <span className="text-md | text-brightGreen">Profile</span>
          <p className="text-xs | text-white3">change the profile settings</p>
        </div>

        {/** change username **/}
        <div className="flex flex-col gap-1 | w-full">
          <span className="block | w-full | text-sm text-white1">Username</span>

          <div className="ml-auto | flex flex-row items-center gap-1">
            <input
              type="text"
              value={username}
              ref={inputRef}
              data-edit={editName}
              className="w-40 text-xs text-white2 | p-1 | rounded-md | bg-black2 | border border-solid border-transparent | data-[edit=true]:border-white1"
              disabled={!editName}
              onChange={(e) => { changeUsername(e.target.value) }}
            />

            <EditButton edit={editName} handleEdit={handleEditName} />
          </div>
        </div>

        {/** change description **/}
        <div className="flex flex-col gap-1">
          <span className="block | w-full | text-sm text-white1">Description</span>

          <div className="ml-auto | flex flex-row items-start gap-1">
            <textarea
              value={description}
              ref={textareaRef}
              data-edit={editDescription}
              disabled={!editDescription}
              onChange={(e) => changeDescription(e.target.value)}
              className="w-52 min-h-[24px] max-h-[200px] | resize-y | text-xs | text-white1 | p-1 | disabled:text-white2 | rounded-md | bg-black2 | border border-solid border-transparent data-[edit=true]:border-white1"
            />

            <EditButton edit={editDescription} handleEdit={handleEditDescription} />
          </div>
        </div>

        {/** change profile picture **/}
        <div className="flex flex-col gap-1">
          
          <span className="block | w-full | text-sm text-white1">Profile Picture</span>

          <div className="ml-auto | flex flex-row items-start gap-1">
            <Avatar
              {...{
                  disabled: !editProfilePicture,
                  source: photo,
                  changeFile,
                  refreshAvatar
                }}
              />

            <EditButton edit={editProfilePicture} handleEdit={handleEditProfilePicture} />
          </div>

        </div>

      </div> 

      {/* Notifications Settings */}
      <div className="w-full | flex flex-col gap-2 | p-1 | border-t border-t-gray2">

        <div className="flex flex-col justify-start | text-white1">
          <span className="text-md | text-brightGreen">Notifications</span>
          <p className="text-xs | text-white3">change the notifications settings</p>
        </div>

        {/** change notifications settings **/}
        <div className="flex flex-row items-center justify-between">
          <span className="text-white1">
            <p className="text-inherit text-sm">
              Enable notifications
            </p>
          </span>          

          <Switch
            enable={enableNotifications}
            toggle={() => changeEnableNotifications(!enableNotifications)}
          />
        </div>

      </div>

      </main>
    </div>
  )
}
