'use client'

import { useAppContext } from 'app/appContext'
import { useMemo } from 'react'
import { Chip, ChipColor } from 'components/Chip'

type MatchedTodoListProps = { labelParam: string }

export default function MatchedTodoList({ labelParam }: MatchedTodoListProps) {
  const { todos, labels, socketError } = useAppContext()

  const matchedTodos = useMemo(
    () =>
      todos.filter((el) => {
        if (!el.labels) return false

        const labels = el.labels.map((el) => el.replace(/ /g, '_'))
        return labels.includes(labelParam)
      }),
    [todos, labelParam],
  )

  const getLabelColor = (label: string) => {
    return (labels.find((el) => el.label === label)?.color ?? 'default') as ChipColor
  }

  return (
    <div>
      <div>{labelParam.replace(/_/g, ' ')}</div>
      <div className="text-red-700">{socketError}</div>
      {matchedTodos.length === 0 ? (
        <div>There are no tasks with this label.</div>
      ) : (
        matchedTodos.map((todo) => {
          return (
            <div id={todo.todoId} key={todo.todoId} className="border-t cursor-move py-4">
              <div className="flex gap-2">
                <div className="pointer-events-none text-gray-400">{todo.todoId}</div>
                <div className="pointer-events-none">{todo.title}</div>
                <div className="pointer-events-none flex gap-2">
                  {todo.labels &&
                    todo.labels.map((el) => (
                      <Chip key={el} label={el} color={getLabelColor(el)} size="small" />
                    ))}
                </div>
              </div>
              <div className="pointer-events-none text-gray-500">{todo.body && todo.body}</div>
              <div className="pointer-events-none">{todo.createdAt}</div>
              <div className="pointer-events-none">done: {todo.completed.toString()} </div>
            </div>
          )
        })
      )}
    </div>
  )
}
