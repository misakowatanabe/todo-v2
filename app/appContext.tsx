'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import io from 'socket.io-client'
import { ENDPOINT } from './config'
import { useRouter } from 'next/navigation'
import { Uid, sendUserId } from 'app/actions'
import { getCookies, setCookies } from 'app/actions'
import { signOut } from 'firebase/auth'

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
  globalError: string | null
}

const FirebaseContext = createContext<FirebaseContextType | null>(null)

type FirebaseContextProps = { children: React.ReactNode }

/**
 * Socket.IO client needs to be excluded from SSR.
 * https://socket.io/how-to/use-with-nextjs#client
 */

export const FirebaseContextProvider = ({ children }: FirebaseContextProps) => {
  const [todo, setTodo] = useState<Todo>([])
  const [user, setUser] = useState<User | null>(null)
  const [socketError, setSocketError] = useState<SocketError>(null)
  const [globalError, setGlobalErrorError] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const socket = io(ENDPOINT, {
      autoConnect: false,
    })

    socket.on('connect_error', () => {
      setSocketError('backendNotAvailable')
      socket.removeAllListeners('todos')
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
        socket.on('todos', (todoList: Todo) => {
          setTodo(todoList)
        })
      }
    })

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        socket.connect()
        setUser(auth.currentUser)
      } else {
        socket.disconnect()
        socket.removeAllListeners('todos')
        setTodo([])
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    if (!user) return

    const interval = setInterval(async () => {
      const hasCookie = await getCookies('currentUser')

      // This becomes true either when currentUser cookie expired or when the cookie manually got deleted
      if (!hasCookie && user) {
        try {
          await signOut(auth)
          router.push('/signin')
        } catch (error) {
          // Setting cookie to keep the user inside the app routes when sign out failed
          await setCookies('currentUser')
          setGlobalErrorError('Sign out has failed')
          console.error(
            'Error signing out: ',
            error instanceof Error ? error.message : String(error),
          )
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [user, router])

  const value = { user, todo, socketError, globalError }

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
}

export const useFirebaseContext = () => {
  const context = useContext(FirebaseContext)

  if (!context) {
    throw new Error('useFirebaseContext must be used within an FirebaseProvider')
  }
  return context
}
