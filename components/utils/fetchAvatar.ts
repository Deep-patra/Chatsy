export const fetchUserAvatar = async (seed: string) => {
  const url = new URL('/api/generateAvatar', location.origin)
  url.searchParams.append('seed', seed)

  const res = await fetch(url)

  if (res.status !== 200)
    return null

  const json = await res.json()
  return json.dataURI

}

export const fetchGroupAvatar = async (seed: string) => {
  const url = new URL('/api/group/generateAvatar', location.origin)
  url.searchParams.append('seed', seed)

  const res = await fetch(url)

  if (res.status !== 200)
    return

  const json = await res.json()
  const uri = json.dataURI

  return uri
}
