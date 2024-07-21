'use client'

import { useFirebaseContext } from '../../appContext'

export default function Todo() {
  const { todo } = useFirebaseContext()

  return (
    <div>
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
