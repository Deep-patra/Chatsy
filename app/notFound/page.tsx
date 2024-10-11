import Link from 'next/link'

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function NotFound({ searchParams }: PageProps) {
  const { error_code = 404 } = searchParams

  return (
    <div className="w-full h-full flex flex-row items-center justify-center">
      <span>{error_code}</span>
      <span>ERROR</span>
    </div>
  )
}
