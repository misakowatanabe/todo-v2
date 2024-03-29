'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import io from 'socket.io-client'
import { ENDPOINT } from './config'

export type Todo = {
  body: string
  createdAt: string
  title: string
  todoId: string
}[]

type FirebaseContextType = {
  user: User | null
  todo: Todo
}

const FirebaseContext = createContext<FirebaseContextType | null>(null)

type FirebaseContextProps = { children: React.ReactNode }

export const FirebaseContextProvider = ({ children }: FirebaseContextProps) => {
  const [todo, setTodo] = useState<Todo>([])
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const socketTodo = io(ENDPOINT, {
      autoConnect: false,
    })

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid
        const uidData = { uid: uid }
        setUser(auth.currentUser)

        try {
          const res = await fetch(`${ENDPOINT}/catch-user-uid`, {
            method: 'POST',
            body: JSON.stringify(uidData),
            headers: {
              'Content-Type': 'application/json',
            },
            mode: 'cors',
          })

          if (res.status) {
            socketTodo.connect()
            socketTodo.on('newChangesInTodos', (todoList: Todo) => {
              setTodo(todoList)
            })
          } else {
            // TODO: redirect to error page
            // or use error boundary
          }
        } catch (error) {
          // TODO: redirect to error page
          // or use error boundary
          console.error(
            'Error, node.js backend is not available',
            error instanceof Error ? error.message : String(error),
          )
        }
      } else {
        socketTodo.disconnect()
        socketTodo.removeAllListeners('newChangesInTodos')
        setTodo([])
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const value = { user, todo }

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
}

export const useFirebaseContext = () => {
  const context = useContext(FirebaseContext)

  if (!context) {
    throw new Error('useFirebaseContext must be used within an FirebaseProvider')
  }
  return context
}
