import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { User } from '@/services/user'

export const useRedirectIfUserIsNull = (
  user: User | null,
  relativePath?: string
) => {
  const router = useRouter()

  useEffect(() => {
    if (!user) router.push(relativePath ?? '/')
  }, [user])
}
