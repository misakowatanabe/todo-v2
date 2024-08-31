type HeadingProps = {
  title: string
  todoLength?: number
  action?: React.ReactNode
}

export function Heading({ title, todoLength, action }: HeadingProps) {
  return (
    <div className="flex justify-between">
      <div className="flex gap-4">
        <div className="my-6 text-4xl h-12 font-bold text-black">{title}</div>
        {todoLength && <div>{todoLength}</div>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
