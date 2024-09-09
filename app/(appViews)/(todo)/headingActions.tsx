'use client'

import { useTransition } from 'react'
import { Todo } from 'app/actions'
import { useAppContext } from 'app/appContext'
import { deleteCompletedTodos } from './deleteCompletedTodos'
import { View } from './todoListItem'
import { DropdownMenu, MenuItem } from 'components/DropdownMenu'
import { ButtonSwitcher } from 'components/ButtonSwitcher'

type HeadingActionsProps = {
  setError: React.Dispatch<React.SetStateAction<string | null>>
  completedTodos?: Todo[]
  setView: React.Dispatch<React.SetStateAction<View>>
  view: View
}

export function HeadingActions({ setError, completedTodos, setView, view }: HeadingActionsProps) {
  const { user } = useAppContext()
  const [isPending, startTransition] = useTransition()

  const verticalDotsIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#222222"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1"></circle>
      <circle cx="12" cy="5" r="1"></circle>
      <circle cx="12" cy="19" r="1"></circle>
    </svg>
  )

  const listIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#222222"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  )

  const gridIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#222222"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  )

  const handleDeleteCompleted = () => {
    setError(null)

    if (!user) return

    startTransition(async () => {
      const res = await deleteCompletedTodos(user.uid)

      if (!res.ok) {
        setError(res.error)
      }
    })
  }

  const menuItems: MenuItem[] = [
    {
      label: 'Delete completed todos',
      onClick: handleDeleteCompleted,
      disabled: isPending || (completedTodos && completedTodos.length === 0),
    },
  ]

  return (
    <div className="flex gap-2.5">
      {/* completed todos deletion is available only on "All" view for now */}
      {completedTodos && (
        <DropdownMenu icon={verticalDotsIcon} items={menuItems} alignment="right" />
      )}
      <ButtonSwitcher
        // the right one is selected when checked
        onChange={(e: any) => setView(e.target.checked ? 'card' : 'table')}
        left={{ icon: listIcon }}
        right={{ icon: gridIcon }}
        checked={view === 'card' ? true : false}
      />
    </div>
  )
}
