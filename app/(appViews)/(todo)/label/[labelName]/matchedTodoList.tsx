'use client'

import { useAppContext } from 'app/appContext'
import { useEffect, useMemo, useRef, useState } from 'react'
import { TodoListItem } from '../../todoListItem'
import { Todo } from 'app/actions'
import { TodoDetail } from '../../todoDetail'
import { DeleteTodoModal } from 'app/(appViews)/(todo)/deleteTodoModal'
import { Heading } from 'components/Heading'
import { Accordion } from 'components/Accordion'
import { Spinner } from 'components/Spinner'
import { Alert } from 'components/Alert'
import { View } from '../../todoListItem'
import { HeadingActions } from '../../headingActions'
import { useLocalStorage } from 'utils/useLocalStorage'
import clsx from 'clsx'

type MatchedTodoListProps = { labelParam: string }

export function MatchedTodoList({ labelParam }: MatchedTodoListProps) {
  const { todos, completedTodos } = useAppContext()
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [labels, setLabels] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTodoToDelete, setSelectedTodoToDelete] = useState<Todo | null>(null)
  const [deleteTodoModalOpen, setDeleteTodoModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useLocalStorage<View>('view-mode', 'table')
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
      <Heading
        title={labelParam.replace(/_/g, ' ')}
        action={<HeadingActions setError={setError} setView={setView} view={view} />}
      />
      <Alert severity="critical" message={error} onClose={() => setError(null)} className="mb-4" />
      {matchedTodos == null || matchedCompletedTodos == null ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {matchedTodos.length === 0 ? (
              <div className="text-gray-600">No active tasks.</div>
            ) : (
              <div className={clsx({ 'flex flex-wrap gap-4': view === 'card' })}>
                {matchedTodos.map((todo) => {
                  return (
                    <TodoListItem
                      key={todo.todoId}
                      todo={todo}
                      openTodo={openTodo}
                      openDeleteTodoModal={openDeleteTodoModal}
                      view={view}
                    />
                  )
                })}
              </div>
            )}
            <Accordion label="Completed" itemLength={matchedCompletedTodos.length}>
              {matchedCompletedTodos.length === 0 ? (
                <div className="text-gray-600">No completed tasks.</div>
              ) : (
                <div className={clsx({ 'flex flex-wrap gap-4': view === 'card' })}>
                  {matchedCompletedTodos.map((todo) => {
                    return (
                      <TodoListItem
                        key={todo.todoId}
                        todo={todo}
                        openTodo={openTodo}
                        openDeleteTodoModal={openDeleteTodoModal}
                        view={view}
                      />
                    )
                  })}
                </div>
              )}
            </Accordion>
          </div>
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
      )}
    </>
  )
}
