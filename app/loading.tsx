import Loader from '@/components/loader'

export default function Loading() {
  return (
    <div className="w-full h-full flex flex-row items-center justify-center">
      <div className="w-20 h-20 relative">
        <Loader color="white" />
      </div>
    </div>
  )
}
