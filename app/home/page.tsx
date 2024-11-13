import { NextPage } from 'next'
import { Suspense } from 'react'
import Home from '@/components/Home'
import Loader from '@/components/loader'

const Loading = () => {
  return (
    <div className="w-full h-full | flex flex-row items-center justify-center">
      <div className="w-10 h-10">
        <Loader color="white"/>
      </div>
    </div>
  )
}

const Page: NextPage = ({ params, searchParams }) => {

  return (
    <Suspense fallback={<Loading/>}>
      <Home/>
    </Suspense>
  )
}

export default Page
