import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
}

export default function Login({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
