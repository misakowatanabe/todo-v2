'use client'

import { useAppContext } from 'app/appContext'
import { useMemo, useState } from 'react'
import { TodoListItem } from '../../todoListItem'
import { Todo } from 'app/actions'
import TodoDetail from '../../todoDetail'
import DeleteTodoModal from '../../DeleteTodoModal'
import { Heading } from 'components/Heading'

type MatchedTodoListProps = { labelParam: string }

export default function MatchedTodoList({ labelParam }: MatchedTodoListProps) {
  const { todos, completedTodos, socketError } = useAppContext()
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [labels, setLabels] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTodoToDelete, setSelectedTodoToDelete] = useState<Todo | null>(null)
  const [deleteTodoModalOpen, setDeleteTodoModalOpen] = useState(false)

  const matchedTodos = useMemo(
    () =>
      todos.filter((el) => {
        if (!el.labels) return false

        const labels = el.labels.map((el) => el.replace(/ /g, '_'))
        return labels.includes(labelParam)
      }),
    [todos, labelParam],
  )

  const matchedCompletedTodos = useMemo(
    () =>
      completedTodos.filter((el) => {
        if (!el.labels) return false

        const labels = el.labels.map((el) => el.replace(/ /g, '_'))
        return labels.includes(labelParam)
      }),
    [completedTodos, labelParam],
  )

  const openTodo = (todo: Todo) => {
    setIsOpen(true)
    setSelectedTodo(todo)

    if (todo.labels) setLabels(todo.labels)
  }

  const openDeleteTodoModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, todo: Todo) => {
    e.stopPropagation()

    setDeleteTodoModalOpen(true)
    setSelectedTodoToDelete(todo)
  }

  return (
    <>
      <Heading title={labelParam.replace(/_/g, ' ')} itemLength={matchedTodos.length} />
      <div className="text-red-700">{socketError}</div>
      {matchedTodos.length === 0 && matchedCompletedTodos.length === 0 ? (
        <div>There are no tasks with this label.</div>
      ) : (
        <>
          {matchedTodos.map((todo) => {
            return (
              <TodoListItem
                key={todo.todoId}
                todo={todo}
                openTodo={openTodo}
                openDeleteTodoModal={openDeleteTodoModal}
                setIsOpen={setIsOpen}
              />
            )
          })}
          {matchedCompletedTodos.map((todo) => {
            return (
              <TodoListItem
                key={todo.todoId}
                todo={todo}
                openTodo={openTodo}
                openDeleteTodoModal={openDeleteTodoModal}
                setIsOpen={setIsOpen}
              />
            )
          })}
          <TodoDetail
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            selectedTodo={selectedTodo}
            labels={labels}
            setLabels={setLabels}
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
