import type { User } from 'firebase/auth'

export const createSession = async (user: User) => {
  const token = await user.getIdToken()

  const res = await fetch('/api/createSession', {
    method: 'POST',
    body: JSON.stringify({ token }),
  })

  if (res.status !== 200) throw new Error('response status is not 200')

  const json = await res.json()

  if (json.result !== 'ok') throw new Error('response is not ok')
}
