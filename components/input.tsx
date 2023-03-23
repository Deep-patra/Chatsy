'use client'

import classNames from "classnames";
import { InputHTMLAttributes, ButtonHTMLAttributes } from "react";

interface SecondaryButton extends ButtonHTMLAttributes<HTMLButtonElement> {}

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  primaryIcon?: JSX.Element,
  secondaryIcon?: JSX.Element,
  secondaryBut?: SecondaryButton
}

export default function Input(props: IInputProps) {
  const { primaryIcon, secondaryIcon, secondaryBut, ...inputProps } = props

  return (
    <div className="relative flex flex-row gap-2 items-center border rounded-md border-solid border-white1 p-3 form-input text-white1">
      {/* PRIMARY ICON */}
      {primaryIcon ? primaryIcon : null}

      <input 
        { ...inputProps } 
        className={classNames(props.className, "w-full text-lg text-white1")}
      />
      {/* SECONDARY ICON */}
      {secondaryIcon ? 
        <button
          {...secondaryBut}
        >
          {secondaryIcon}
        </button>
      : null}
    </div>
  )
}