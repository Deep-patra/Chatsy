import { useState, useEffect, type RefObject } from 'react'

/**
 * Hook to detect the click event outside the component
 * @param {boolean} open - state 
 * @param {(boolean) => void} close - Callback for closing 
 * @param {RefObject<HTMLElement>[]} ...args - An array of element references the click will exclude
 * */
const useOutClick = (
  open: boolean,
  close: () => void,
  ...args: RefObject<HTMLElement>[]
) => {

  const toggleMenu = (result: boolean) => {
    close()
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
        close()
      }
    }

    window.addEventListener('click', handler, false)

    return () => {
      window.removeEventListener('click', handler, false)
    }
  }, [])
}

export default useOutClick
