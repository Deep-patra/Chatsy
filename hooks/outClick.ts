import { useState, useEffect, type RefObject } from 'react'

/**
 * Hook to detect the click event outside the component
 * @param {RefObject<HTMLElement>[]} ...args - An array of element references the click will exclude
 *
 * @returns {[boolean, (boolean) => void]} - A pair containing state and callback to change the open state
 * */
const useOutClick = (
  ...args: RefObject<HTMLElement>[]
): [boolean, (result: boolean) => void] => {
  const [open, toggle] = useState<boolean>(false)

  const toggleMenu = (result: boolean) => {
    toggle(result)
  }

  const checkIfTarget = (event: Event): boolean => {
    let result = false

    const path = event.composedPath()

    args.forEach((value) => {
      if (path.includes(value.current as EventTarget)) result = true
    })

    return result
  }

  useEffect(() => {
    const handler = (event: Event) => {
      if (!checkIfTarget(event)) {
        toggle(false)
      }
    }

    window.addEventListener('click', handler, false)

    return () => {
      window.removeEventListener('click', handler, false)
    }
  }, [])

  return [open, toggleMenu]
}

export default useOutClick
