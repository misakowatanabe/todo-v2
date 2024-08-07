'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import io from 'socket.io-client'
import { ENDPOINT } from './config'
import { useRouter } from 'next/navigation'
import { sendIdToken } from 'app/actions'
import { getCookies, setCookies } from 'app/actions'
import { signOut } from 'firebase/auth'

export type Todo = {
  body: string
  createdAt: string
  title: string
  todoId: string
}[]

type SocketError = 'backendNotAvailable' | 'dataNotFound' | null

type AppContextType = {
  user: User | null
  todo: Todo
  socketError: SocketError
  globalError: string | null
}

const AppContext = createContext<AppContextType | null>(null)

type AppContextProps = { children: React.ReactNode }

/**
 * Socket.IO client needs to be excluded from SSR.
 * https://socket.io/how-to/use-with-nextjs#client
 */

export const AppContextProvider = ({ children }: AppContextProps) => {
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

      /** This sends the user's ID token to Node.js server, verify the integrity and authenticity of
       * the ID token and retrieve the uid from it.
       * https://firebase.google.com/docs/auth/admin/verify-id-tokens#web
       */
      const idToken = await auth.currentUser.getIdToken(true)
      const res = await sendIdToken(idToken)

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
      const userLoggedIn = await getCookies('user_logged_in')

      if (userLoggedIn) return

      // Sign out user either when user_logged_in cookie expired or when the cookie manually got deleted
      try {
        await signOut(auth)
        router.push('/signin')
      } catch (error) {
        // Set login status cookie to keep the user inside the app routes when sign out failed
        await setCookies('user_logged_in')
        setGlobalErrorError('Sign out has failed')
        console.error('Error signing out: ', error instanceof Error ? error.message : String(error))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [user, router])

  const value = { user, todo, socketError, globalError }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within an FirebaseProvider')
  }
  return context
}
