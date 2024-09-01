'use client'

import { useAppContext } from 'app/appContext'
import { useState, useTransition } from 'react'
import { Todo, tickTodo, untickTodo } from 'app/actions'
import { Chip, ChipColor } from 'components/Chip'
import { Checkbox } from 'components/Checkbox'
import clsx from 'clsx'

type TodoListItemProps = {
  todo: Todo
  openTodo: (_todo: Todo) => void
  openDeleteTodoModal: (_e: React.MouseEvent<HTMLDivElement, MouseEvent>, _todo: Todo) => void
} & (
  | {
      dragStart: (_e: React.DragEvent<HTMLDivElement>) => void
      dragEnter: (_e: React.DragEvent<HTMLDivElement>) => void
      drop: () => Promise<void>
    }
  | {
      dragStart?: never
      dragEnter?: never
      drop?: never
    }
)

export function TodoListItem({
  todo,
  dragStart,
  dragEnter,
  drop,
  openTodo,
  openDeleteTodoModal,
}: TodoListItemProps) {
  const { labels: availableLabels } = useAppContext()
  // TODO: show this error as snackbar or global error
  // eslint-disable-next-line
  const [error, setError] = useState<string | null>(null)
  // TODO: add visual feedback on pending
  // eslint-disable-next-line
  const [isPending, startTransition] = useTransition()

  const handleTick = (todoId: Pick<Todo, 'todoId'>) => {
    startTransition(async () => {
      const res = await tickTodo(todoId)

      if (!res.ok) {
        setError(res.error)
      }
    })
  }

  const handleUntick = (todoId: Pick<Todo, 'todoId'>) => {
    startTransition(async () => {
      const res = await untickTodo(todoId)

      if (!res.ok) {
        setError(res.error)
      }
    })
  }

  const getLabelColor = (label: string) => {
    return (availableLabels.find((el) => el.label === label)?.color ?? 'default') as ChipColor
  }

  const removeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      role="graphics-symbol"
      aria-labelledby="title-79 desc-79"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )

  return (
    <div key={todo.todoId} className="group flex border-t items-start gap-2">
      <div className="py-2">
        <Checkbox
          onChange={() =>
            // TODO: add handleUntick with a new API
            todo.completed
              ? handleUntick(todo.todoId as unknown as Pick<Todo, 'todoId'>)
              : handleTick(todo.todoId as unknown as Pick<Todo, 'todoId'>)
          }
          checked={todo.completed}
          id={`todo-${todo.todoId}`}
        />
      </div>
      <div
        id={todo.todoId}
        className={clsx('py-4 grow', { 'cursor-pointer': dragStart })}
        onDragStart={(e) => dragStart?.(e)}
        onDragOver={(e) => e.preventDefault()}
        draggable={true}
        onDragEnter={(e) => dragEnter?.(e)}
        onDragEnd={(e) => e.preventDefault()}
        onDrop={drop}
        onClick={() => openTodo(todo)}
      >
        <div className="pointer-events-none flex justify-between items-center">
          <div className="pointer-events-none flex gap-2">
            <div className="pointer-events-none">{todo.title}</div>
            {/* TODO: remove todo ID (only for dev) */}
            <div className="pointer-events-none text-gray-400">{todo.todoId}</div>
            <div className="pointer-events-none flex gap-2">
              {todo.labels &&
                todo.labels.map((el) => (
                  <Chip key={el} label={el} color={getLabelColor(el)} size="small" />
                ))}
            </div>
          </div>
          {!todo.completed && (
            <div
              className="pointer-events-auto group-hover:flex hidden h-6 w-6 justify-center items-center rounded-full hover:bg-gray-200"
              onClick={(e) =>
                // TODO: add openDeleteCompletedTodoModal with a new API and make the icon visible again
                todo.completed ? undefined : openDeleteTodoModal(e, todo)
              }
            >
              {removeIcon}
            </div>
          )}
        </div>
        {todo.body && (
          <p className="pointer-events-none text-gray-500 text-sm line-clamp-1 mt-1">{todo.body}</p>
        )}
      </div>
    </div>
  )
}
