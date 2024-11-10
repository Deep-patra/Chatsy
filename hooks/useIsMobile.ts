import { useState, useEffect } from 'react'


interface IUseIsMobileOptions {
  threshold?: number
}

export const useIsMobile = (options?: IUseIsMobileOptions): boolean => {
  const threshold = options ? ( options.threshold || 600 ) : 600

  const [isMobile, changeIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const handleResize = (event: UIEvent) => {
      const width = window.innerWidth

      if (width <= threshold && !isMobile)
        changeIsMobile(true)
    }
    
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile
}
