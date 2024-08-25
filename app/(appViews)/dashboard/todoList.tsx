'use client'

import { useAppContext } from 'app/appContext'
import { useEffect, useRef, useState } from 'react'
import { Todo, updateOrder } from 'app/actions'
import { Chip, ChipColor } from 'components/Chip'
import TodoDetail from './todoDetail'

export default function TodoList() {
  const { todos, labels: availableLabels, socketError } = useAppContext()
  const [localOrderedTodos, setLocalOrderedTodos] = useState<Todo[]>([])
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [labels, setLabels] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
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

  return (
    <div>
      <div className="text-red-700">{socketError}</div>
      {localOrderedTodos.map((todo) => {
        return (
          <div
            id={todo.todoId}
            key={todo.todoId}
            className="border-t cursor-move py-4"
            onDragStart={(e) => dragStart(e)}
            onDragOver={(e) => e.preventDefault()}
            draggable={true}
            onDragEnter={(e) => dragEnter(e)}
            onDragEnd={(e) => e.preventDefault()}
            onDrop={drop}
            onClick={() => openTodo(todo)}
          >
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
    </div>
  )
}
