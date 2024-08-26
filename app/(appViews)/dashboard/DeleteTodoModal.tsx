'use client'

import { useState, useTransition } from 'react'
import { Todo, deleteTodo } from 'app/actions'
import Modal from 'components/Modal'
import { Button } from 'components/Button'

type SubmitProps = { isPending: boolean; onDelete: React.MouseEventHandler<HTMLButtonElement> }

function Submit({ isPending, onDelete }: SubmitProps) {
  return (
    <Button
      type="button"
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

export default function DeleteTodoModal({
  deleteTodoModalOpen,
  setDeleteTodoModalOpen,
  selectedTodoToDelete,
}: DeleteTodoModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const onDelete = () => {
    if (!selectedTodoToDelete) return

    startTransition(async () => {
      const res = await deleteTodo(selectedTodoToDelete.todoId as unknown as Pick<Todo, 'todoId'>)

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
      {error && (
        <div className="flex items-center text-red-700">
          <div>{error}</div>
          <Button
            type="button"
            style="text"
            size="small"
            label="OK"
            onClick={() => setError(null)}
          />
        </div>
      )}
      <div className="flex flex-col gap-6">
        <div>Are you sure you want to delete this todo?</div>
        <div className="font-semibold">&quot;{selectedTodoToDelete.title}&quot;</div>
      </div>
    </Modal>
  )
}
