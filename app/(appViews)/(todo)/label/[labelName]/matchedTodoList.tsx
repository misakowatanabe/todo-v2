'use client'

import { useAppContext } from 'app/appContext'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Todo } from 'app/actions'
import { TodoDetail } from '../../todoDetail'
import { DeleteTodoModal } from '../../deleteTodoModal'
import { TodoListLayout } from 'app/(appViews)/(todo)/todoListLayout'

type MatchedTodoListProps = { labelParam: string }

export function MatchedTodoList({ labelParam }: MatchedTodoListProps) {
  const { todos, completedTodos, view } = useAppContext()
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [labels, setLabels] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTodoToDelete, setSelectedTodoToDelete] = useState<Todo | null>(null)
  const [deleteTodoModalOpen, setDeleteTodoModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (isOpen) return

    setLabels([])
    setSelectedTodo(null)

    if (!formRef.current) return

    formRef.current.reset()
  }, [isOpen])

  const matchedTodos = useMemo(() => {
    if (todos == null) return null

    return todos.filter((el) => {
      if (!el.labels) return false

      const labels = el.labels.map((el) => el.replace(/ /g, '_'))
      return labels.includes(labelParam)
    })
  }, [todos, labelParam])

  const matchedCompletedTodos = useMemo(() => {
    if (completedTodos == null) return null

    return completedTodos.filter((el) => {
      if (!el.labels) return false

      const labels = el.labels.map((el) => el.replace(/ /g, '_'))
      return labels.includes(labelParam)
    })
  }, [completedTodos, labelParam])

  const openTodo = (todo: Todo) => {
    setIsOpen(true)
    setSelectedTodo(todo)

    if (todo.labels) setLabels(todo.labels)
  }

  const openDeleteTodoModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, todo: Todo) => {
    e.stopPropagation()

    setDeleteTodoModalOpen(true)
    setSelectedTodoToDelete(todo)
  }

  return (
    <>
      <TodoListLayout
        setError={setError}
        error={error}
        todos={matchedTodos}
        completedTodos={matchedCompletedTodos}
        view={view}
        openTodo={openTodo}
        openDeleteTodoModal={openDeleteTodoModal}
        type="label"
      />
      <TodoDetail
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedTodo={selectedTodo}
        labels={labels}
        setLabels={setLabels}
        formRef={formRef}
      />
      {selectedTodoToDelete && (
        <DeleteTodoModal
          deleteTodoModalOpen={deleteTodoModalOpen}
          setDeleteTodoModalOpen={setDeleteTodoModalOpen}
          selectedTodoToDelete={selectedTodoToDelete}
        />
      )}
    </>
  )
}
