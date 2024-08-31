type HeadingProps = {
  title: string
  itemLength?: number
  action?: React.ReactNode
}

export function Heading({ title, itemLength, action }: HeadingProps) {
  return (
    <div className="flex justify-between items-center my-6 h-12">
      <div className="flex gap-4 items-center">
        <div className="text-4xl font-bold text-black">{title}</div>
        {itemLength && (
          <div className="flex justify-center text-2xl outline outline-1 outline-offset-0 rounded-sm min-w-8 outline-gray-300">
            {itemLength}
          </div>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
