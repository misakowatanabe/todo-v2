'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import io from 'socket.io-client'
import { ENDPOINT } from './config'
import { useRouter } from 'next/navigation'
import { Uid, sendUserId } from 'app/actions'

export type Todo = {
  body: string
  createdAt: string
  title: string
  todoId: string
}[]

type SocketError = 'backendNotAvailable' | 'dataNotFound' | null

type FirebaseContextType = {
  user: User | null
  todo: Todo
  socketError: SocketError
}

const FirebaseContext = createContext<FirebaseContextType | null>(null)

type FirebaseContextProps = { children: React.ReactNode }

export const FirebaseContextProvider = ({ children }: FirebaseContextProps) => {
  const [todo, setTodo] = useState<Todo>([])
  const [user, setUser] = useState<User | null>(null)
  const [socketError, setSocketError] = useState<SocketError>(null)

  const router = useRouter()

  useEffect(() => {
    const socket = io(ENDPOINT, {
      autoConnect: false,
    })

    socket.on('connect_error', () => {
      setSocketError('backendNotAvailable')
      socket.removeAllListeners('newChangesInTodos')
      setTodo((prev) => {
        if (prev.length === 0) return prev
        return []
      })
    })

    socket.on('connect', async () => {
      if (!auth.currentUser) return

      // This sends user ID to node.js backend for Firebase admin SDK use
      const uidObject = { userUid: auth.currentUser.uid } as Uid
      const res = await sendUserId(uidObject)

      if (!res) {
        setSocketError('dataNotFound')
      } else {
        setSocketError(null)
        socket.on('newChangesInTodos', (todoList: Todo) => {
          setTodo(todoList)
        })
      }
    })

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        router.push('/dashboard')
        socket.connect()
        setUser(auth.currentUser)
      } else {
        router.push('/signin')
        socket.disconnect()
        socket.removeAllListeners('newChangesInTodos')
        setTodo([])
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [router])

  const value = { user, todo, socketError }

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
}

export const useFirebaseContext = () => {
  const context = useContext(FirebaseContext)

  if (!context) {
    throw new Error('useFirebaseContext must be used within an FirebaseProvider')
  }
  return context
}
