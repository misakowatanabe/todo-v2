type HeadingProps = {
  title: string
  action?: React.ReactNode
}

export function Heading({ title, action }: HeadingProps) {
  return (
    <div className="flex justify-between items-center my-6 h-12">
      <div className="text-4xl font-bold text-black">{title}</div>
      {action && <div>{action}</div>}
    </div>
  )
}
