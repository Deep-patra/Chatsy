'use client'
import type { FormEvent } from 'react'
import { useState } from 'react'
import Input from '@/components/input'
import { motion } from 'framer-motion'
import {
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from 'react-icons/ai'

export const ForgotPassword = () => {
  const [new_password, changePassword] = useState<string>('')
  const [showPass, changeShowPass] = useState<boolean>(false)

  const handleInputChange = () => {}

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <form action="/change_password" method="POST" onSubmit={handleSubmit}>
      <Input
        name="newPassword"
        type={showPass ? 'text' : 'password'}
        value={new_password}
        onChange={handleInputChange}
        primaryIcon={<AiOutlineLock className="text-2xl text-white1" />}
        secondaryIcon={
          showPass ? (
            <AiOutlineEyeInvisible className="text-2xl text-white2" />
          ) : (
            <AiOutlineEye className="text-2xl text-white2" />
          )
        }
        secondaryBut={{
          type: 'button',
          'aria-label': 'Toggle password visibility',
          onClick: () => {
            changeShowPass(!showPass)
          },
        }}
      />

      <div className="w-full flex flex-row items-center justify-center">
        <motion.button
          type="submit"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 px-3 rounded-md text-white1 border border-solid border-white1 bg-transparent hover:bg-white1 hover:text-black2"
          aria-label="Change password "
        >
          Change Password
        </motion.button>
      </div>
    </form>
  )
}
