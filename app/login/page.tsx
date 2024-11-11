import { Suspense } from 'react'
import LoginForm from '@/components/Login'
import './login.module.css'

export default function Login() {
  return (
    <main className="row-start-2 row-end-3 w-full h-full flex flex-row items-center justify-center">
      <div className="relative form-container">
        <Suspense fallback={<></>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  )
}
