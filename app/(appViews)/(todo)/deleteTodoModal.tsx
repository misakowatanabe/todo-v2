'use client'

import { useState, useTransition } from 'react'
import { useAppContext } from 'app/appContext'
import { Todo } from 'app/actions'
import { Modal } from 'components/Modal'
import { Button } from 'components/Button'
import { deleteTodo } from './deleteTodo'
import { Alert } from 'components/Alert'

type SubmitProps = { isPending: boolean; onDelete: React.MouseEventHandler<HTMLButtonElement> }

function Submit({ isPending, onDelete }: SubmitProps) {
  return (
    <Button
      type="submit"
      label={isPending ? 'Deleting...' : 'Delete'}
      disabled={isPending}
      onClick={onDelete}
    />
  )
}

type DeleteTodoModalProps = {
  deleteTodoModalOpen: boolean
  setDeleteTodoModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedTodoToDelete: Todo
}

export function DeleteTodoModal({
  deleteTodoModalOpen,
  setDeleteTodoModalOpen,
  selectedTodoToDelete,
}: DeleteTodoModalProps) {
  const { user } = useAppContext()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const onDelete = () => {
    if (!selectedTodoToDelete) return

    if (!user) return

    startTransition(async () => {
      const res = await deleteTodo(
        user.uid,
        selectedTodoToDelete.todoId,
        selectedTodoToDelete.completed,
      )

      if (!res.ok) {
        setError(res.error)
      } else {
        setDeleteTodoModalOpen(false)
      }
    })
  }

  return (
    <Modal
      title="Delete todo"
      setIsShowing={setDeleteTodoModalOpen}
      isShowing={deleteTodoModalOpen}
      okButton={<Submit isPending={isPending} onDelete={onDelete} />}
    >
      <div className="flex flex-col gap-6">
        <Alert severity="critical" message={error} onClose={() => setError(null)} />
        <div>Are you sure you want to delete this todo?</div>
        <div className="font-semibold">&quot;{selectedTodoToDelete.title}&quot;</div>
      </div>
    </Modal>
  )
}
