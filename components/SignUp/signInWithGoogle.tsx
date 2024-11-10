'use client'

import { motion } from 'framer-motion'
import { BsGoogle } from 'react-icons/bs'

interface ISignInWithGoogleProps {
  handleClick: () => void
}

export default function SignInWithGoogle(props: ISignInWithGoogleProps) {
  return (
    <div className="relative w-full">
      <motion.button
        type="button"
        aria-label="sign in with google"
        whileHover={{ scale: 0.96 }}
        whileTap={{ scale: 0.9 }}
        className="w-full flex flex-row items-center justify-center gap-2 p-2 border border-solid border-white1 bg-white1 rounded-md text-black1 hover:bg-transparent hover:text-white1 transition-color duration-300"
        onClick={props.handleClick}
      >
        <BsGoogle className="text-2xl text-inherit" />
        <span className="text-lg text-inherit flex flex-row items-center">
          Sign in with Google
        </span>
      </motion.button>
    </div>
  )
}
