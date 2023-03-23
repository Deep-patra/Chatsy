'use client'
import { useRef, useEffect } from 'react'

interface ILoaderProps {
  color: string;
}

export default function Loader(props: ILoaderProps) {
  const { color } = props

  const svgRef = useRef<SVGSVGElement>(null)
  const path = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (path.current && svgRef.current) {
      const length = path.current.getTotalLength()

      // svg rotation animation
      svgRef.current.animate([
        { rotate: "z 0deg" },
        { rotate: "z 360deg" },
      ], {
        duration: 500,
        easing: 'linear',
        iterations: Infinity,
      })

      // path animation
      path.current.animate([
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: length * 0.3 },
        { strokeDasharray: length, strokeDashoffset: length }
      ], {
        duration: 2000,
        easing: 'linear',
        iterations: Infinity,
      })
    }
  }, [])

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 66.403282 66.403282"
      version="1.1"
      id="svg5"
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      className="origin-center"
    >
      <defs id="defs2" />
      <g id="layer1" transform="translate(-46.61711,-46.61711)">
        <path
          id="path846"
          ref={path}
          style={{ fill: 'none', stroke: color, strokeWidth: '1', strokeLinecap: 'round' }}
          d="M 102.35893,79.818748 A 22.540178,22.540178 0 0 1 79.818748,102.35893 22.540178,22.540178 0 0 1 57.27857,79.818748 22.540178,22.540178 0 0 1 79.818748,57.27857 22.540178,22.540178 0 0 1 102.35893,79.818748 Z"
        />
      </g>
    </svg>
  );
}
