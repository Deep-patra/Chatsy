import { useState, type ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import { MdOutlineAlternateEmail } from 'react-icons/md'
import {
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from 'react-icons/ai'
import Input from '../input'

interface ILoginFormProps {
  loginWithEmailPassword: (email: string, password: string) => void
}

export default function LoginFrom(props: ILoginFormProps) {
  const [email, changeEmail] = useState<string>('')
  const [password, changePassword] = useState<string>('')
  const [showPass, changePassVisiblity] = useState<boolean>(false)

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    changeEmail(target.value)
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    changePassword(target.value)
  }

  const handlePassVisiblity = (event: any) => {
    changePassVisiblity(!showPass)
  }

  const handleSubmit = (event: any) => {
    if (email !== '' && password !== '') {
      props.loginWithEmailPassword(email, password)
    }
  }

  return (
    <form className="flex flex-col w-full gap-2 relative">
      <Input
        type="email"
        placeholder="Email"
        onChange={handleEmailChange}
        autoComplete="true"
        primaryIcon={
          <MdOutlineAlternateEmail className="text-2xl text-white1" />
        }
      />

      <Input
        type={showPass ? 'text' : 'password'}
        placeholder="Password"
        onChange={handlePasswordChange}
        autoComplete="true"
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
          onClick: handlePassVisiblity,
        }}
      />

      <div className="w-full flex flex-row justify-center items-center">
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 px-3 rounded-md text-white1 border border-solid border-white1 bg-transparent hover:bg-white1 hover:text-black2"
          aria-label="login button"
          onClick={handleSubmit}
        >
          Log In
        </motion.button>
      </div>
    </form>
  )
}
