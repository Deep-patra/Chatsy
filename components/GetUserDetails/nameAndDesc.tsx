import Input from '@/components/input'

interface NameAndDescriptionProps {
  name: string
  description: string
  onNameChange: (event: any) => void
  onDescriptionChange: (event: any) => void
}

export default function NameAndDescription(props: NameAndDescriptionProps) {
  return (
    <>
      {/* Username Input */}
      <div className="flex flex-col gap-1 | w-full">
        <span className="text-white1 text-sm | p-1">Username</span>
        <Input
          name="name"
          type="text"
          className="text-xs p-1"
          value={props.name}
          placeholder="e.g. JohnDoe"
          onChange={props.onNameChange}
        />
      </div>

      {/* Description Textarea */}
      <div className="flex flex-col gap-1 | w-full">
        <span className="flex flex-row items-center gap-1 | text-white1 text-sm | p-1">
          <p className="text-inherit">Description</p>
          <p className="text-sm text-white3">(optional)</p>
        </span>
        <div className="">
          <textarea
            name="description"
            value={props.description}
            className="min-h-[100px] | resize-y | text-xs text-white1 | w-full | border border-solid border-white3 | focus:border-white hover:border-white1 | rounded-md | p-1"
            onChange={props.onDescriptionChange}
            placeholder="Write something about yourself..."
          ></textarea> 
        </div>
      </div>
    </>    
  )
}
