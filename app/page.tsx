import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className="dark-background-image row-start-2 row-end-3 p-2 w-full h-full flex flex-col items-center justify-center | rounded-md">
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-5xl font-mono text-brightGreen">Chatsy</h1>
        <span className="text-white3 text-sm text-center">
          A Simple, Secure, and Reliable messaging application.
        </span>

        <div className="flex flex-col gap-5">
          <Link
            href="/signup"
            title="signup"
            data-testidd="signup"
            className="text-center p-2 px-3 border rounded-md border-solid border-white1 text-white1 hover:bg-brightWhite2 hover:text-black1 hover:scale-95 transition-colors duration-300"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            title="login"
            data-testid="login"
            className="text-center p-2 px-3 rounded-md border border-solid border-white1 text-white1 hover:bg-brightWhite2 hover:text-black1 hover:scale-95 transition-colors duration-300"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  )
}
