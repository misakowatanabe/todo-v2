'use client'

import { useTransition } from 'react'
import { Todo } from 'app/actions'
import { useAppContext } from 'app/appContext'
import { deleteCompletedTodos } from './deleteCompletedTodos'
import { View } from './todoListItem'
import { DropdownMenu, MenuItem } from 'components/DropdownMenu'
import { ButtonSwitcher } from 'components/ButtonSwitcher'
import { Icon } from 'components/icons'

type HeadingActionsProps = {
  setError: React.Dispatch<React.SetStateAction<string | null>>
  completedTodos?: Todo[]
  setView: React.Dispatch<React.SetStateAction<View>>
  view: View
}

export function HeadingActions({ setError, completedTodos, setView, view }: HeadingActionsProps) {
  const { user } = useAppContext()
  const [isPending, startTransition] = useTransition()

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
        <DropdownMenu icon={<Icon.Ellipsis size="medium" />} items={menuItems} alignment="right" />
      )}
      <ButtonSwitcher
        // one on the right is selected when checked
        onChange={(e: any) => setView(e.target.checked ? 'card' : 'table')}
        left={{ icon: <Icon.List /> }}
        right={{ icon: <Icon.Grid /> }}
        checked={view === 'card' ? true : false}
        testid="switch-view"
      />
    </div>
  )
}
