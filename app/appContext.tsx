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

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        router.push('/dashboard')

        setUser(auth.currentUser)

        const uidObject = { userUid: user.uid } as Uid
        const res = await sendUserId(uidObject)

        // check if sedning user ID to node.js backend has succedded for Firebase admin SDK use
        if (!res.ok) {
          // This uses global error view (global-error.tsx) in prod
          throw new Error('Failed to send user to backend')
        } else {
          socketTodo.connect()
          socketTodo.on('newChangesInTodos', (todoList: Todo) => {
            setTodo(todoList)
          })
        }
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
