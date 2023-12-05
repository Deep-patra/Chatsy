import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type ChangeEventHandler,
} from 'react'
import Image from 'next/image'
import classnames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { FaCamera } from 'react-icons/fa'
import { TiTick } from 'react-icons/ti'
import { RxCross1 } from 'react-icons/rx'
import { MdOutlineEdit } from 'react-icons/md'
import { FaRegEdit } from 'react-icons/fa'
import Tooltip from '../tootip'
import Loader from '../loader'
import Storage from '@/services/storage.service'
import User from '@/services/user.service'
import { type IUser } from '@/context/auth.context'

interface IEditProfileProps {
  user: IUser
}

interface IEditProfilePicture {
  imageSrc: string
  onChange: (file: File) => Promise<void>
  onCancel: () => void
}

interface IEditProfileName {
  name: string
  onChange: (name: string) => Promise<void>
}

const EditProfilePicture = ({ imageSrc, onChange }: IEditProfilePicture) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [loading, setLoading] = useState<boolean>(false)
  const [file, changeFile] = useState<File | null>(null)

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const _file = event.target.files && event.target.files[0]

    if (_file) {
      changeFile(_file)
    }
  }

  const handleConfirm = () => {
    if (file) {
      // show loading Overlay
      setLoading(true)

      onChange(file).finally(() => {
        setLoading(false)
      })
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden w-0 h-0 appearance-none"
        accept="image/*"
      />

      <h5 className="text-white2 text-md md:text-lg flex flex-row items-center gap-2">
        <FaRegEdit className="w-4 h-4 text-inherit" />
        Upload picture
      </h5>

      <div className="rounded-full w-min flex relative mx-auto">
        {/* Image */}
        <div className="w-32 h-32 rounded-full overflow-hidden relative">
          <Image
            src={file ? URL.createObjectURL(file) : imageSrc}
            alt="Change profile picture"
            fill
          />

          {/* Loading Overlay */}
          {loading && (
            <div className="w-full h-full absolute top-0 left-0 flex-shrink-0 flex flex-row items-center justify-center bg-black/50">
              <div className="w-8 h-8">
                <Loader color="#fff" />
              </div>
            </div>
          )}
        </div>

        {/* Upload Button */}
        {!file && (
          <Tooltip text="Upload">
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="absolute bottom-0 right-0 z-10 p-2 rounded-full bg-blue text-white1 disabled:text-white3 disabled:cursor-not-allowed disabled:bg-black3"
              onClick={() => {
                // Click the file input element
                inputRef.current && inputRef.current.click()
              }}
            >
              <FaCamera className="w-4 h-4 text-inherit" />
            </motion.button>
          </Tooltip>
        )}

        {/* Confirm and Cancel Button */}
        {file && (
          <div className="flex flex-row items-center gap-2 z-5 absolute bottom-0 right-0 translate-x-full">
            <Tooltip text="Confirm">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2 z-10 rounded-full bg-green shadow-md text-white1"
                disabled={loading}
                onClick={handleConfirm} // Send the file on click
              >
                <TiTick className="w-4 h-4 text-inherit" />
              </motion.button>
            </Tooltip>

            <Tooltip text="Cancel">
              <motion.button
                whileTap={{ scale: 0.9 }}
                disabled={loading}
                className="p-2 z-10 rounded-full bg-warning shadow-md text-white1 disabled:text-white3 disabled:cursor-not-allowed disabled:bg-black3"
                onClick={() => {
                  changeFile(null)
                }}
              >
                <RxCross1 className="w-4 h-4 text-inherit" />
              </motion.button>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  )
}

const EditProfileName = ({ name, onChange }: IEditProfileName) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [loading, setLoading] = useState<boolean>(false)
  const [edit, changeEdit] = useState<boolean>(false)
  const [value, changeValue] = useState<string>(name)

  const [_, transition] = useTransition()

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const _value = (event.target as HTMLInputElement).value

    transition(() => {
      changeValue(_value)
    })
  }

  const handleClick = () => {
    if (edit && value !== name) {
      // show the loading state
      setLoading(true)

      onChange(value).finally(() => {
        setLoading(false)
      })

      return
    }

    changeEdit(true)

    // focus the input
    if (inputRef.current) inputRef.current.focus()
  }

  const handleCancel = () => {
    // change the input value to default
    changeValue(name)

    // close edit mode
    changeEdit(false)
  }

  return (
    <div className="flex flex-col md:flex-row justify-between w-full gap-2">
      <h5 className="text-white2 text-md md:text-lg flex flex-row items-center gap-2">
        <FaRegEdit className="w-4 h-4 text-inherit" />
        Edit name
      </h5>

      <div className="flex flex-row items-center gap-2">
        <div
          className={classnames('p-1 rounded-md border border-solid ', {
            'cursor-not-allowed border-white3': !edit,
            'border-white1': edit,
          })}
        >
          <input
            ref={inputRef}
            disabled={!edit || loading} // disabled if edit mode is false or loading is true
            className="text-sm md:text-md text-white1 appearance-none disabled:cursor-not-allowed disabled:text-white3"
            onChange={handleChange}
            value={value}
          />
        </div>

        <div className="flex flex-row items-center gap-2">
          <Tooltip text={!loading ? (!edit ? 'edit' : 'confirm') : 'loading'}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={classnames(
                'p-2 bg-black2 text-white1 rounded-full transition-colors disabled:text-white3 disabled:bg-black3 disabled:cursor-not-allowed',
                {
                  'bg-green': value !== name,
                }
              )}
              disabled={(value === name && edit) || loading} // Disable the button if edit mode is true and name haven't been changed or loading is true
              onClick={handleClick}
            >
              {loading && (
                <div className="w-5 h-5">
                  <Loader color="#fff" />
                </div>
              )}
              {!edit && !loading && (
                <MdOutlineEdit className="w-4 h-4 text-inherit" />
              )}
              {edit && !loading && <TiTick className="w-4 h-4 text-inherit" />}
            </motion.button>
          </Tooltip>

          {/* Cancel Button */}
          <AnimatePresence>
            {edit && (
              <Tooltip text="cancel">
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="bg-warning p-2 rounded-full text-white1 disabled:text-white3 disabled:bg-black3 disabled-cursor-not-allowed"
                  onClick={handleCancel}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  <RxCross1 className="w-4 h-4 text-inherit" />
                </motion.button>
              </Tooltip>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default function EditProfile({ user }: IEditProfileProps) {
  const [imageSrc, changeImageSrc] = useState<string>(
    user.photoURL || '/user.png'
  )

  const handleChange = async (file: File) => {
    // store the image in firebase storage
    const url = await Storage.storeImage(file)

    if (!url) throw new Error('Url is null')

    await User.update(user.uid, { photoURL: url })
  }

  const handleImageCancel = () => {
    changeImageSrc(user.photoURL || '/user.png')
  }

  const handleNameChange = async (name: string) => {
    if (name !== user.name) await User.update(user.uid, { name })
  }

  return (
    <div className="flex flex-col w-full gap-4 md:gap-6 p-2">
      <EditProfilePicture
        {...{ imageSrc, onChange: handleChange, onCancel: handleImageCancel }}
      />
      <EditProfileName
        {...{ name: user.name || '', onChange: handleNameChange }}
      />
    </div>
  )
}
