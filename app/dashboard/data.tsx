'use client'

import { useFirebaseContext } from '../appContext'

export default function Data() {
  const { user, todo } = useFirebaseContext()

  // TODO: protect private root
  return (
    <div>
      <div>User name: {user?.displayName}</div>
      <div>User email: {user?.email}</div>
      <div>Dashboard</div>
      {todo.map((todo) => {
        return (
          <div key={todo.todoId}>
            <div>{todo.title}</div>
            <div>{todo.body}</div>
            <div>{todo.createdAt}</div>
          </div>
        )
      })}
    </div>
  )
}
