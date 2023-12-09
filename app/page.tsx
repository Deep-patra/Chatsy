import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className="row-start-2 row-end-3 p-2 w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-white1 text-xl">Chatsy</h1>
        <span className="text-white3 text-center">
          A Simple, Reliable, and Secure messaging application.
        </span>

        <div className="flex flex-col gap-5">
          <Link
            href="/signup"
            title="signup"
            data-testidd="signup"
            className="text-center p-2 px-3 border rounded-lg border-solid border-white1 text-white1 hover:bg-white1 hover:text-black1 transition-colors"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            title="login"
            data-testid="login"
            className="text-center p-2 px-3 rounded-lg border border-solid border-white1 text-white1 hover:bg-white1 hover:text-black1 transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  )
}
