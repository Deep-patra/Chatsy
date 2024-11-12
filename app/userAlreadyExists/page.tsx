import { ImConfused2 } from 'react-icons/im'

export default function Page() {
  return (
    <main className="w-full h-full | flex flex-row items-center justify-center">
      <section className="flex flex-col items-center gap-4">
        <ImConfused2 className="w-10 h-10 text-white1" />

        <span className="text-sm text-white2">
          <p>User with the same credentials already exists</p>
          <span className="flex flex-row items-center justify-center gap-1 | w-full">
            <p>Try</p>
            <a
              href="/login"
              title="login"
              className="text-brightGreen | hover:underline"
            >
              login
            </a>
          </span>
        </span>
      </section>
    </main>
  )
}
