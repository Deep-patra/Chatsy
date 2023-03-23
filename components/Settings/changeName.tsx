import { useState, useRef, useEffect, type ChangeEvent, type MouseEventHandler } from "react";
import { motion } from 'framer-motion'
import { FiEdit } from "react-icons/fi";
import Loader from '@/components/loader'
import UserService from '@/services/user.service'

interface IChangeNameProps {
  uid: string;
  name: string | null | undefined;
  email: string | null | undefined;
}

export default function ChangeName(props: IChangeNameProps) {
  const { uid, name, email } = props;

  const inputRef = useRef<HTMLInputElement>(null)

  const [loading, changeLoading] = useState<boolean>(false)
  const [value, changeValue] = useState<string>(name || "");
  const [edit, toggleEdit] = useState<boolean>(false);
  const [showError, changeError] = useState<boolean>(false);

  const handleEdit: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation()
    toggleEdit(true);

    if (inputRef.current) {
      const input = inputRef.current
      input.focus()
    }
  };

  const handleSave = () => {
    if (value.trim() !== "") {
      // loading 
      changeLoading(true)
      UserService.update(uid, { name: value })
        .catch(console.error)
        .finally(() => {
          changeLoading(false)
          toggleEdit(false)
        })
    }
  }

  const handleCancel = () => { changeValue(name || ""); toggleEdit(false) }

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    changeValue(target.value)
  };

  useEffect(() => {
    if (value.trim() === "") changeError(true)
    else { showError && changeError(false) }
  }, [value])

  return (
    <div className="flex flex-col gap-5 flex-grow">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-3 rounded-lg border border-solid border-white2 p-2 px-3">
          <span className="text-xl text-white2">Name</span>

          <div className="flex flex-row items-center gap-3 flex-grow">
            <input
              type="text"
              ref={inputRef}
              value={value}
              disabled={!edit}
              className="text-lg text-white1 disabled:text-white3 flex-grow"
              onChange={handleNameChange}
            />

            {edit ? (
              <div className="flex flex-row items-center text-base gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={name === value}
                  className="p-1 px-2 rounded-md border border-solid border-green text-green disabled:text-white3 disabled:border-white3 disabled:bg-white3 disabled:cursor-not-allowed hover:bg-green hover:text-white1"
                  onClick={handleSave}
                >
                  {
                    loading ? (
                      <div className="w-7 h-7 relative">
                        <Loader color="white" />
                      </div>
                    ) : "Save"
                  }
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 px-2 rounded-md border border-solid border-warning text-warning hover:bg-warning hover:text-white1"
                  onClick={handleCancel}
                >
                  Cancel
                </motion.button>
              </div>
            ) : (
              <button
                type="button"
                aria-label="Edit button"
                className="p-2 rounded-full text-white2 hover:bg-black2 hover:text-white1"
                onClick={handleEdit}
              >
                <FiEdit className="text-xl text-inherit" />
              </button>
            )}
          </div>
        </div>

        {showError && (
          <span className="text-sm text-warning">
            Name cannot be a blank space
          </span>
        )}
      </div>

      <div className="flex flex-row items-center gap-3 rounded-lg border border-solid border-white2 p-2 px-3" style={{ cursor: "not-allowed" }}>
        <span className="text-xl text-white2 cursor-not-allowed">Email</span>
        <span className="text-lg text-white3 cursor-not-allowed">{email}</span>
      </div>
    </div>
  );
}
