import { Suspense } from 'react'
import SignupForm from '@/components/SignUp'

const Signup = () => {
  return (
    <main className="w-full h-full flex flex-row items-center justify-center">
      <Suspense fallback={<></>}>
        <SignupForm />
      </Suspense>
    </main>
  )
}

export default Signup
