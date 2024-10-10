
interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function Page({ searchParams }: PageProps) {
  const { session_id } = searchParams;

  return (
    <main className="row-start-2 row-end-3 w-full h-full flex flex-row items-center justify-center">
      <div className="relative">
        <span>{session_id}</span>        
      </div>
    </main>
  )
}
