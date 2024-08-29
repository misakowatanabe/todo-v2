import { ReactNode } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

type ListItemProps = (
  | {
      href?: string
      onClick?: never
      pathname?: string
    }
  | {
      href?: never
      onClick?: (_event: React.MouseEvent<HTMLDivElement>) => void
      pathname?: never
    }
) & { label: string; icon: ReactNode; action?: ReactNode }

export function ListItem({ href, label, icon, action, onClick, pathname }: ListItemProps) {
  const currentPath = pathname?.toLowerCase().replace(/_/g, ' ').endsWith(label.toLowerCase())
  const className = 'flex justify-start gap-3 w-full items-center'

  const contents = (
    <>
      <div
        className={clsx({ 'text-gray-600': pathname === undefined || !/(label)/.test(pathname) })}
      >
        {icon}
      </div>
      <div className={clsx('text-gray-700', { 'font-semibold': currentPath })}>{label}</div>
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
    <div
      className={clsx(
        'flex justify-between items-center group h-12 px-3 rounded gap-1 cursor-pointer',
        currentPath ? 'bg-gray-200 hover:bg-gray-300' : 'hover:bg-gray-100',
      )}
    >
      {onClick ? itemAsDiv : itemAsLink}
      {action && action}
    </div>
  )
}
