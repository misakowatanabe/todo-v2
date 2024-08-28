import { ReactNode } from 'react'
import Link from 'next/link'

type ListItemProps = (
  | {
      href?: string
      onClick?: never
    }
  | {
      href?: never
      onClick?: (_event: React.MouseEvent<HTMLDivElement>) => void
    }
) & { label: string; icon: ReactNode; action?: ReactNode }

export function ListItem({ href, label, icon, action, onClick }: ListItemProps) {
  const className = 'flex justify-start gap-3 w-full items-center'
  const contents = (
    <>
      <div>{icon}</div>
      <div>{label}</div>
    </>
  )

  const itemAsLink = (
    <Link href={href ?? '/'} className={className}>
      {contents}
    </Link>
  )
  const itemAsDiv = (
    <div className={className} onClick={onClick}>
      {contents}
    </div>
  )

  return (
    <div className="flex justify-between items-center group h-12 px-3 hover:bg-gray-100 rounded gap-1 cursor-pointer">
      {onClick ? itemAsDiv : itemAsLink}
      {action && action}
    </div>
  )
}
