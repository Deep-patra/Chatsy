import type { ImgHTMLAttributes } from 'react'
import {  } from 'react'
import classnames from 'classnames'

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {}

export default function Image(props: ImageProps) {
  return (
    <div
      className={classnames("relative overflow-hidden", props.className)}
    >
      <img
        {...props}
        className="w-full h-full object-contain"
      />
    </div>
  )
}
