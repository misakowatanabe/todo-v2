'use client'

import { useAppContext } from 'app/appContext'
import { useEffect, useRef, useState } from 'react'
import { Todo, updateOrder } from 'app/actions'

export default function TodoList() {
  const { todos, socketError } = useAppContext()
  const [localOrderedTodos, setLocalOrderedTodos] = useState<Todo[]>([])
  const dragItem = useRef('')
  const dragOverItem = useRef('')

  useEffect(() => {
    if (!todos) return

    setLocalOrderedTodos(todos)
  }, [todos])

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

  return (
    <div>
      <div className="text-red-700">{socketError}</div>
      {localOrderedTodos.map((todo) => {
        return (
          <div
            id={todo.todoId}
            key={todo.todoId}
            className="border-t cursor-move py-4 flex gap-8"
            onDragStart={(e) => dragStart(e)}
            onDragOver={(e) => e.preventDefault()}
            draggable={true}
            onDragEnter={(e) => dragEnter(e)}
            onDragEnd={(e) => e.preventDefault()}
            onDrop={drop}
          >
            <div className="pointer-events-none">ID: {todo.todoId}</div>
            <div className="pointer-events-none">Title: {todo.title}</div>
            <div className="pointer-events-none">Body: {todo.body && todo.body}</div>
            <div className="pointer-events-none">Created at:{todo.createdAt}</div>
            <div className="pointer-events-none">
              Labels:
              {todo.labels && todo.labels.map((el) => <div key={el}>{el}</div>)}
            </div>
            <div className="pointer-events-none">done: {todo.completed.toString()} </div>
          </div>
        )
      })}
    </div>
  )
}
