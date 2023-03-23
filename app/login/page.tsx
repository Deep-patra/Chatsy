import LoginForm from '@/components/Login'
import './login.module.css'

export default function Login() {
  return (
    <main className="w-full h-full flex flex-row items-center justify-center">
      <div className="relative form-container">
        <LoginForm/>
      </div>
    </main>
  )
}