import { useEffect } from 'react'
import hljs from 'highlight.js'

export const useRegisterSW = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }

    hljs.highlightAll()
  }, [])
}
