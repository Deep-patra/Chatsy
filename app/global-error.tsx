'use client'

interface IGlobalErrorProps {
  error: Error
  reset: () => void
}

export default function GloablError(props: IGlobalErrorProps) {
  return (
    <html>
      <head>
        <title>ERROR</title>
      </head>
      <body>
        <h2>Something went wrong !</h2>
      </body>
    </html>
  )
}
