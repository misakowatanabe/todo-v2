'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth, db } from './firebase'
import { useRouter } from 'next/navigation'
import { Todo, deleteCookies, getCookies, setCookies } from 'app/actions'
import { signOut } from 'firebase/auth'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'

type Label = { label: string; color: string }

type Error = string | null

type AppContextType = {
  user: User | null
  todos: Todo[]
  completedTodos: Todo[]
  labels: Label[]
  globalError: Error
}

const AppContext = createContext<AppContextType | null>(null)

type AppContextProps = { children: React.ReactNode }

export const AppContextProvider = ({ children }: AppContextProps) => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [labels, setLabels] = useState<Label[]>([])
  const [globalError, setGlobalError] = useState<Error>(null)

  const router = useRouter()

  useEffect(() => {
    if (!user) return

    const unsubTodos = onSnapshot(
      doc(db, user.uid, 'todos'),
      async (docSnapshot) => {
        const todosData = docSnapshot.data()
        const order = await getDoc(doc(db, user.uid, 'order'))
        const orderData = order.data()
        let todoListActive = []
        let todoListCompleted = []

        // Skip filtering active todos unless there is any todo
        if (todosData) {
          todoListActive = Object.values(todosData).filter((el) => {
            return !el.completed
          })

          todoListCompleted = Object.values(todosData).filter((el) => {
            return el.completed
          })
        }

        // Skip ordering active todos unless there is order data
        if (orderData) {
          const activeOrder = orderData.active
          todoListActive.sort((a, b) => {
            return activeOrder.indexOf(a.todoId) - activeOrder.indexOf(b.todoId)
          })

          const completedOrder = orderData.completed
          todoListCompleted.sort((a, b) => {
            return completedOrder.indexOf(a.todoId) - completedOrder.indexOf(b.todoId)
          })
        }

        setTodos(todoListActive)
        setCompletedTodos(todoListCompleted)
      },
      (err) => {
        // A listen may occasionally fail — for example, due to security permissions, or if you tried to listen on an invalid query
        console.error(err)
      },
    )

    const unsubLables = onSnapshot(
      doc(db, user.uid, 'labels'),
      async (docSnapshot) => {
        const labelsData = docSnapshot.data()
        let labelsArray = []
        if (labelsData) {
          labelsArray = Object.values(labelsData)
        }

        setLabels(labelsArray)
      },
      (err) => {
        // A listen may occasionally fail — for example, due to security permissions, or if you tried to listen on an invalid query
        console.error(err)
      },
    )

    return () => {
      unsubTodos()
      unsubLables()
    }
  }, [user])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(auth.currentUser)
      } else {
        setTodos([])
        setUser(null)

        try {
          await deleteCookies('user_logged_in')
        } catch {
          // Set login status cookie to keep the user inside the app routes when sign out failed
          await setCookies('user_logged_in')
          setGlobalError('Sign out has failed')
        }
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
        setGlobalError('Sign out has failed')
        console.error('Error signing out: ', error instanceof Error ? error.message : String(error))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [user, router])

  const value = { user, todos, completedTodos, labels, globalError }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider')
  }
  return context
}
