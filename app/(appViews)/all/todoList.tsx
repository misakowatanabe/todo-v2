'use client'

import { useAppContext } from 'app/appContext'
import { useEffect, useRef, useState, useTransition } from 'react'
import { Todo, tickTodo, updateOrder } from 'app/actions'
import { Chip, ChipColor } from 'components/Chip'
import { Checkbox } from 'components/Checkbox'
import { Button } from 'components/Button'
import TodoDetail from './todoDetail'
import DeleteTodoModal from './DeleteTodoModal'

export default function TodoList() {
  const { todos, completedTodos, labels: availableLabels, socketError } = useAppContext()
  const [localOrderedTodos, setLocalOrderedTodos] = useState<Todo[]>([])
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [labels, setLabels] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTodoToDelete, setSelectedTodoToDelete] = useState<Todo | null>(null)
  const [deleteTodoModalOpen, setDeleteTodoModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // TODO: add visual feedback on pending
  // eslint-disable-next-line
  const [isPending, startTransition] = useTransition()
  const dragItem = useRef('')
  const dragOverItem = useRef('')

  useEffect(() => {
    if (!todos) return

    setLocalOrderedTodos(todos)
  }, [todos])

  useEffect(() => {
    if (isOpen) return

    setLabels([])
    setSelectedTodo(null)
  }, [isOpen])

  useEffect(() => {
    if (deleteTodoModalOpen) return

    setSelectedTodoToDelete(null)
  }, [deleteTodoModalOpen])

  const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
    dragItem.current = (e.target as HTMLTableRowElement).id
  }

  const dragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    dragOverItem.current = (e.target as HTMLDivElement).id
  }

  const drop = async () => {
    const todosCopy = [...localOrderedTodos]
    const dragItemContent = todosCopy.find((el) => el.todoId === dragItem.current)
    const dragOverItemContent = todosCopy.find((el) => el.todoId === dragOverItem.current)

    if (!dragItemContent || !dragOverItemContent) return

    const dragItemContentIndex = todosCopy.indexOf(dragItemContent)
    const dragOverItemContentIndex = todosCopy.indexOf(dragOverItemContent)
    todosCopy.splice(dragItemContentIndex, 1)
    todosCopy.splice(dragOverItemContentIndex, 0, dragItemContent)

    setLocalOrderedTodos(todosCopy)
    const order = todosCopy.map((el) => el.todoId)
    await updateOrder(order)

    dragItem.current = ''
    dragOverItem.current = ''
  }

  const getLabelColor = (label: string) => {
    return (availableLabels.find((el) => el.label === label)?.color ?? 'default') as ChipColor
  }

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

  const removeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
      role="graphics-symbol"
      aria-labelledby="title-79 desc-79"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )

  const handleTick = (todoId: Pick<Todo, 'todoId'>) => {
    startTransition(async () => {
      const res = await tickTodo(todoId)

      if (!res.ok) {
        setError(res.error)
      } else {
        setIsOpen(false)
      }
    })
  }

  return (
    <div>
      <div className="text-red-700">{socketError}</div>
      {error && (
        <div className="flex labels-center text-red-700">
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
      {localOrderedTodos.map((todo) => {
        return (
          <div key={todo.todoId} className="group flex border-t items-start gap-2">
            <div className="py-2">
              <Checkbox
                onChange={() => handleTick(todo.todoId as unknown as Pick<Todo, 'todoId'>)}
                checked={todo.completed}
                id={`todo-${todo.todoId}`}
              />
            </div>
            <div
              id={todo.todoId}
              className="cursor-pointer py-4 grow"
              onDragStart={(e) => dragStart(e)}
              onDragOver={(e) => e.preventDefault()}
              draggable={true}
              onDragEnter={(e) => dragEnter(e)}
              onDragEnd={(e) => e.preventDefault()}
              onDrop={drop}
              onClick={() => openTodo(todo)}
            >
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="pointer-events-none">{todo.title}</div>
                  <div className="pointer-events-none text-gray-400">{todo.todoId}</div>
                  <div className="pointer-events-none flex gap-2">
                    {todo.labels &&
                      todo.labels.map((el) => (
                        <Chip key={el} label={el} color={getLabelColor(el)} size="small" />
                      ))}
                  </div>
                </div>
                <div
                  className="group-hover:flex hidden h-6 w-6 justify-center items-center"
                  onClick={(e) => openDeleteTodoModal(e, todo)}
                >
                  {removeIcon}
                </div>
              </div>
              {todo.body && (
                <p className="pointer-events-none text-gray-500 text-sm line-clamp-1 mt-1">
                  {todo.body}
                </p>
              )}
            </div>
          </div>
        )
      })}
      {completedTodos.map((todo) => {
        return (
          <div key={todo.todoId} className="group flex border-t items-start">
            <div className="py-2">
              <Checkbox
                // onChange={(e) => handleTick(e, todo.todoId as unknown as Pick<Todo, 'todoId'>)}
                onChange={() => {}}
                checked={todo.completed}
                id={`todo-${todo.todoId}`}
              />{' '}
            </div>
            <div onClick={() => openTodo(todo)} className="py-4">
              <div className="flex justify-between items-center gap-2">
                <div className="flex gap-2">
                  <div className="pointer-events-none text-gray-400 line-through">
                    {todo.todoId}
                  </div>
                  <div className="pointer-events-none text-gray-400 line-through">{todo.title}</div>
                  <div className="pointer-events-none flex gap-2">
                    {todo.labels &&
                      todo.labels.map((el) => (
                        <Chip key={el} label={el} color={getLabelColor(el)} size="small" />
                      ))}
                  </div>
                </div>
              </div>
              <div className="pointer-events-none text-gray-400 line-through">
                {todo.body && todo.body}
              </div>
              <div className="pointer-events-none text-gray-400 line-through">{todo.createdAt}</div>
            </div>
          </div>
        )
      })}
      {selectedTodo && (
        <TodoDetail
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedTodo={selectedTodo}
          labels={labels}
          setLabels={setLabels}
        />
      )}
      {selectedTodoToDelete && (
        <DeleteTodoModal
          deleteTodoModalOpen={deleteTodoModalOpen}
          setDeleteTodoModalOpen={setDeleteTodoModalOpen}
          selectedTodoToDelete={selectedTodoToDelete}
        />
      )}
    </div>
  )
}
