import { useState, useRef, useEffect, Fragment } from 'react'

interface IItem {
  label: string
  active: boolean
  element: JSX.Element
}

interface ITabsProps {
  direction: 'vertical' | 'horizontal'
  items: IItem[]
}


export default function Tabs({ direction, items }: ITabsProps) {
  const flexDirection = direction === 'vertical' ? 'column' : 'row'
  
  const [currentElementUnderMouse, changeElement] = useState<HTMLElement | null>(null)
  const [activeElement, changeActive] = useState<HTMLDivElement | null>(null)

  const animateRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    
  }, [currentElementUnderMouse])

  return (
    <div className="relative">
      <ul style={{ flexDirection }} className="flex gap-1" >
        {items.map((item, index) => (
          <li
            key={index}
            className=""
            onMouseOver={(event) => { changeElement(event?.target as HTMLElement) }}
            onMouseOut={(event) => {
              event.target === currentElementUnderMouse && changeElement(null)
            }}
          >
            <Fragment key={index}>
              {item.element}
            </Fragment>
          </li>
        ))}
      </ul>

      <div ref={animateRef} className="absolute"></div>
    </div>
  ) 
}
