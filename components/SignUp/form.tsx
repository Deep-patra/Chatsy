"use client";

import { MouseEvent, useState, type ChangeEvent } from "react";
import classNames from 'classnames'
import { MdOutlineAlternateEmail } from "react-icons/md";
import { motion } from 'framer-motion'
import {
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import Input from "../input";


interface ISignupFormProps {
  signUpWithEmailPassword: (email: string, password: string) => void
}


export default function SignupForm(props: ISignupFormProps) {
  const [email, changeEmail] = useState<string>("");
  const [password, changePassword] = useState<string>("");
  const [showPass, changePassVisibility] = useState<boolean>(false);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    changeEmail(target.value);
  };

  const handlePassChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    changePassword(target.value);
  };

  const handlePassVisibility = (event: MouseEvent) => {
    changePassVisibility(!showPass);
  };

  const handleSubmit = () => {
    if (email !== "" && password !== "") {
      props.signUpWithEmailPassword(email, password)
    }
  }

  return (
    <form className="w-full h-full flex flex-col gap-3 text-white2">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        autoComplete="true"
        primaryIcon={
          <MdOutlineAlternateEmail className="text-white2 text-lg" />
        }
      />

      <Input
        type={showPass ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={handlePassChange}
        autoComplete="true"
        primaryIcon={<AiOutlineLock className="text-white2 text-lg" />}
        secondaryIcon={
          <>
            <AiOutlineEye className={classNames( "text-lg text-white2", { hidden: showPass })} />
            <AiOutlineEyeInvisible className={classNames( "text-lg text-white2", { hidden: !showPass })} />
          </>
        }
        secondaryBut={{
          type: "button",
          "aria-label": "toggle password visibility",
          onClick: handlePassVisibility,
        }}
      />

      <div className="flex flex-row items-center justify-center">
        <motion.button
          type="button"
          aria-label="submit"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="px-4 py-2 text-lg rounded-md border text-white1 border-white2 border-solid hover:bg-white1 hover:text-black1 hover:border-white1 transition-colors"
          onClick={handleSubmit}
        >
          Sign Up
        </motion.button>
      </div>
    </form>
  );
}
