import { useCallback } from 'react'
import Input from '@/components/input'

interface IGetNameAndDescription {
  name: string
  description: string
  changeName: (name: string) => void
  changeDescription: (description: string) => void
}

export default function GetNameAndDescription(props: IGetNameAndDescription) {
  const { name, description, changeName, changeDescription } = props

  const handleInputChange = useCallback((event: any) => {
    const target = event.target as HTMLInputElement
    changeName(target.value)
  }, [])

  const handleTextareaChange = useCallback((event: any) => {
    const target = event.target as HTMLTextAreaElement
    changeDescription(target.value)
  }, [])

  return (
    <div className="flex flex-col gap-3 | w-full">
      {/* Name field */}
      <div className="flex flex-col gap-1 | w-full">
        <span className="text-sm text-white1">
          <p>Group name</p>
        </span>
        <Input
          type="text"
          value={name}
          placeholder="Group Name"
          className="text-xs | text-white1 | w-full"
          onChange={handleInputChange}
        />
      </div>

      {/* Description Field */}
      <div className="flex flex-col gap-1">
        <span className="text-sm text-white1">
          <p>Group description</p>
        </span>

        <div className="text-xs | p-1 | border border-white2 | rounded-md | hover:border-white1">
          <textarea
            value={description}
            placeholder="Group description..."
            className="w-full min-h-[100px] max-h-[300px] | text-xs | text-white1 | resize-y"
            onChange={handleTextareaChange}
          />
        </div>
      </div>
    </div>
  )
}
