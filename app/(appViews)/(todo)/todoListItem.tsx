'use client'

import { Label, useAppContext } from 'app/appContext'
import { useState, useTransition } from 'react'
import { Todo } from 'app/actions'
import { Chip, ChipColor, ColorVariants } from 'components/Chip'
import { Checkbox } from 'components/Checkbox'
import { Icon } from 'components/icons'
import { Button } from 'components/Button'
import clsx from 'clsx'
import { tickTodo } from './tickTodo'
import { untickTodo } from './untickTodo'

export type View = 'table' | 'card'

type TodoListItemProps = {
  todo: Todo
  openTodo: (_todo: Todo) => void
  openDeleteTodoModal: (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>, _todo: Todo) => void
  view: View
} & (
  | {
      dragStart: (_e: React.DragEvent<HTMLButtonElement>) => void
      dragEnter: (_e: React.DragEvent<HTMLDivElement>) => void
      drop: () => Promise<void>
    }
  | {
      dragStart?: never
      dragEnter?: never
      drop?: never
    }
)

export function getLabelColor(label: string, availableLabels: Label[] | null) {
  if (availableLabels == null) return 'default'

  return (availableLabels.find((el) => el.label === label)?.color ?? 'default') as ChipColor
}

export function TodoListItem({
  todo,
  dragStart,
  dragEnter,
  drop,
  openTodo,
  openDeleteTodoModal,
  view,
}: TodoListItemProps) {
  const { labels: availableLabels, user } = useAppContext()
  // TODO: show this error as snackbar or global error
  // eslint-disable-next-line
  const [error, setError] = useState<string | null>(null)
  // TODO: add visual feedback on pending
  // eslint-disable-next-line
  const [isPending, startTransition] = useTransition()

  const handleTick = (todoId: Pick<Todo, 'todoId'>) => {
    if (!user) return

    startTransition(async () => {
      const res = await tickTodo(user.uid, todoId)

      if (!res.ok) {
        setError(res.error)
      }
    })
  }

  const handleUntick = (todoId: Pick<Todo, 'todoId'>) => {
    if (!user) return

    startTransition(async () => {
      const res = await untickTodo(user.uid, todoId)

      if (!res.ok) {
        setError(res.error)
      }
    })
  }

  const cardBgColor: ColorVariants = {
    default: 'bg-gray-300/20',
    raspberry: 'bg-raspberry/20',
    honey: 'bg-honey/20',
    blueberry: 'bg-blueberry/20',
    greenApple: 'bg-greenApple/20',
    orange: 'bg-orange/20',
    midnight: 'bg-midnight/20',
    powderPink: 'bg-powderPink/20',
    sky: 'bg-sky/20',
    lemon: 'bg-lemon/20',
    lime: 'bg-lime text-white/20',
    dreamyPurple: 'bg-dreamyPurple/20',
  }

  if (view === 'table')
    return (
      <div
        key={todo.todoId}
        className="group flex first:border-none border-t items-stretch gap-2 hover:bg-gray-50 rounded"
        id={todo.todoId}
        onDragOver={(e) => dragStart && e.preventDefault()}
        onDragEnter={(e) => dragStart && dragEnter?.(e)}
        onDragEnd={(e) => dragStart && e.preventDefault()}
        onDrop={dragStart && drop}
      >
        <div className="relative flex mt-2" id={todo.todoId}>
          {dragStart && (
            <Button
              style="text"
              type="button"
              size="small"
              icon={<Icon.Grab />}
              id={todo.todoId}
              onDragStart={(e) => dragStart?.(e)}
              draggable={true}
              hover={false}
              className="absolute left-0 group-hover:block hidden mt-1 cursor-grab"
            />
          )}
          <Checkbox
            onChange={() =>
              todo.completed
                ? handleUntick(todo.todoId as unknown as Pick<Todo, 'todoId'>)
                : handleTick(todo.todoId as unknown as Pick<Todo, 'todoId'>)
            }
            checked={todo.completed}
            id={todo.todoId}
            className="ml-5"
          />
        </div>
        <div
          id={todo.todoId}
          className="relative py-4 grow cursor-pointer"
          onClick={() => openTodo(todo)}
        >
          <div className="pointer-events-none flex justify-between items-center">
            <div className="pointer-events-none flex gap-2">
              <div
                className={clsx(
                  'pointer-events-none',
                  todo.completed ? 'line-through text-gray-400' : 'text-black',
                )}
              >
                {todo.title}
              </div>
              <div className="pointer-events-none flex gap-2">
                {todo.labels &&
                  todo.labels.map((el) => (
                    <Chip
                      key={el}
                      label={el}
                      color={getLabelColor(el, availableLabels)}
                      size="small"
                    />
                  ))}
              </div>
            </div>
            <Button
              size="small"
              style="text"
              type="button"
              icon={<Icon.Close />}
              onClick={(e) => openDeleteTodoModal(e, todo)}
              className="absolute right-0 pointer-events-auto group-hover:flex hidden"
            />
          </div>
          {todo.body && (
            <p
              className={clsx(
                'pointer-events-none text-sm line-clamp-1 mt-1',
                todo.completed ? 'line-through text-gray-400' : 'text-gray-600',
              )}
            >
              {todo.body}
            </p>
          )}
        </div>
      </div>
    )

  // card view
  return (
    <div
      key={todo.todoId}
      id={todo.todoId}
      onDragOver={(e) => dragStart && e.preventDefault()}
      onDragEnter={(e) => dragStart && dragEnter?.(e)}
      onDragEnd={(e) => dragStart && e.preventDefault()}
      onDrop={dragStart && drop}
      className={clsx(
        'group flex items-start gap-0.5 w-80 h-80 p-3 rounded-lg shadow-md',
        todo.labels
          ? cardBgColor[getLabelColor(todo.labels[0], availableLabels)]
          : cardBgColor.default,
      )}
    >
      <div className="relative -mt-1.5 -ml-1.5" id={todo.todoId}>
        <Checkbox
          onChange={() =>
            todo.completed
              ? handleUntick(todo.todoId as unknown as Pick<Todo, 'todoId'>)
              : handleTick(todo.todoId as unknown as Pick<Todo, 'todoId'>)
          }
          checked={todo.completed}
          id={todo.todoId}
        />
        {dragStart && (
          <Button
            style="text"
            type="button"
            size="small"
            icon={<Icon.Grab />}
            id={todo.todoId}
            onDragStart={(e) => dragStart?.(e)}
            draggable={true}
            hover={false}
            className="absolute left-0 group-hover:block hidden ml-1.5 cursor-grab"
          />
        )}
      </div>
      <div
        id={todo.todoId}
        className="relative flex flex-col grow h-full cursor-pointer"
        onClick={() => openTodo(todo)}
      >
        <div className="pointer-events-none flex justify-between items-center">
          <div
            className={clsx(
              'pointer-events-none text-xl',
              todo.completed ? 'line-through text-gray-400' : 'text-black',
            )}
          >
            {todo.title}
          </div>
          <Button
            size="small"
            style="text"
            type="button"
            icon={<Icon.Close />}
            onClick={(e) => openDeleteTodoModal(e, todo)}
            className="absolute right-0 pointer-events-auto group-hover:flex hidden"
          />
        </div>
        <div className="pointer-events-none text-gray-500 text-base mt-3 grow">
          <p
            className={clsx(
              'line-clamp-[9]',
              todo.completed ? 'line-through text-gray-400' : 'text-gray-600',
            )}
          >
            {todo.body && todo.body}
          </p>
        </div>
        <div className="pointer-events-none flex gap-2 justify-end">
          {todo.labels &&
            todo.labels.map((el) => (
              <Chip key={el} label={el} color={getLabelColor(el, availableLabels)} size="small" />
            ))}
        </div>
      </div>
    </div>
  )
}
