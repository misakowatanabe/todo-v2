'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import io from 'socket.io-client'
import { ENDPOINT } from './config'
import { useRouter } from 'next/navigation'
import { Uid, sendUserId } from 'app/api/route'

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

  const router = useRouter()

  useEffect(() => {
    const socketTodo = io(ENDPOINT, {
      autoConnect: false,
    })

    socketTodo.on('connect_error', () => {
      socketTodo.removeAllListeners('newChangesInTodos')
      setTodo((prev) => {
        if (prev.length === 0) return prev
        return []
      })
    })

    socketTodo.on('connect', async () => {
      if (!auth.currentUser) return

      const uidObject = { userUid: auth.currentUser.uid } as Uid
      const res = await sendUserId(uidObject)
      if (!res.ok) {
        // This uses global error view (global-error.tsx) in prod
        throw new Error('Failed to send user to backend')
      } else {
        socketTodo.on('newChangesInTodos', (todoList: Todo) => {
          setTodo(todoList)
        })
      }
    })

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        router.push('/dashboard')
        socketTodo.connect()
        setUser(auth.currentUser)
      } else {
        router.push('/signin')
        socketTodo.disconnect()
        socketTodo.removeAllListeners('newChangesInTodos')
        setTodo([])
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [router])

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
