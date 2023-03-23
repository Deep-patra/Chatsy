import { useState, useEffect, type RefObject } from 'react'

const useOutClick = (...args: RefObject<HTMLElement>[]): [boolean, (result: boolean) => void] => {
  const [open, toggle] = useState<boolean>(false)

  const toggleMenu = (result: boolean) => {
    toggle(result)
  }

  const checkIfTarget = (target: HTMLElement): boolean => {
    let result = false

    args.forEach((value) => {
      if (value.current === target) result = true
    })

    return result
  }
  
  useEffect(() => {
    const handler = (event: Event) => {
      if (checkIfTarget(event.target as HTMLElement)) {
        toggle(false)
      }
    }

    window.addEventListener("click", handler, false)

    return () => {
      window.removeEventListener("click", handler, false)
    }
  }, [])

  return [open, toggleMenu]
}

export default useOutClick