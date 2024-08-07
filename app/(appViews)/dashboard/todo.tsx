'use client'

import { useAppContext } from 'app/appContext'

export default function Todo() {
  const { todo, socketError } = useAppContext()

  return (
    <div>
      <div className="text-red-700">{socketError}</div>
      {todo.map((todo) => {
        return (
          <div key={todo.todoId} className="border">
            <div>Title: {todo.title}</div>
            <div>Body: {todo.body}</div>
            <div>Created at:{todo.createdAt}</div>
          </div>
        )
      })}
    </div>
  )
}
