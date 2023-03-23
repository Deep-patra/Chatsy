import { BsTwitter } from 'react-icons/bs'

interface ISignInWithTwitterProps {
  handleClick: () => void;
}

export default function SignInWithTwitter(props: ISignInWithTwitterProps) {
  return (
    <div className="relative w-full">
    <button
      type="button"
      aria-label="sign in with google"
      className="w-full flex flex-row items-center justify-center gap-2 p-2 border border-solid border-primary rounded-md text-secondary hover:bg-primary hover:text-lightBackground"
      onClick={props.handleClick}
    >
      <BsTwitter className="text-2xl text-inherit" />
      <span className="text-lg text-inherit flex flex-row items-center">
        Sign in with Twitter
      </span>
    </button>
  </div>
  )
}