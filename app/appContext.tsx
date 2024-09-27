'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth, db } from './firebase'
import { useRouter } from 'next/navigation'
import { Todo, deleteCookies, getCookies, setCookies } from 'app/actions'
import { signOut } from 'firebase/auth'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { View, useLocalStorage } from 'utils/useLocalStorage'

export type Label = { label: string; color: string }

type Error = string | null

type AppContextType = {
  user: User | null
  todos: Todo[] | null
  completedTodos: Todo[] | null
  labels: Label[] | null
  setGlobalError: React.Dispatch<React.SetStateAction<Error>>
  globalError: Error
  setView: React.Dispatch<React.SetStateAction<View>>
  view: View
}

const AppContext = createContext<AppContextType | null>(null)

type AppContextProps = { children: React.ReactNode }

export const AppContextProvider = ({ children }: AppContextProps) => {
  const [todos, setTodos] = useState<Todo[] | null>(null)
  const [completedTodos, setCompletedTodos] = useState<Todo[] | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [labels, setLabels] = useState<Label[] | null>(null)
  const [globalError, setGlobalError] = useState<Error>(null)
  const [view, setView] = useLocalStorage<View>('view-mode', 'table')

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

        // skip filtering active todos unless there is any todo
        if (todosData) {
          todoListActive = Object.values(todosData).filter((el) => {
            return !el.completed
          })

          todoListCompleted = Object.values(todosData).filter((el) => {
            return el.completed
          })
        }

        // skip ordering active todos unless there is order data
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
      (_error) => {
        // a listen may occasionally fail — for example, due to security permissions, or an invalid query
        setGlobalError('Something happened! Could not remove todos listener.')
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
      (_error) => {
        // a listen may occasionally fail — for example, due to security permissions, or an invalid query
        setGlobalError('Something happened! Could not remove labels listener.')
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
        setTodos(null)
        setCompletedTodos(null)
        setLabels(null)
        setUser(null)
        await deleteCookies('user_logged_in')
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    if (!user) return

    const interval = setInterval(async () => {
      const userLoggedIn = await getCookies('user_logged_in')

      if (userLoggedIn) return

      // sign out user either when user_logged_in cookie expired or when the cookie manually got deleted
      try {
        await signOut(auth)
        router.push('/signin')
      } catch (error) {
        // set login status cookie to keep the user inside the app routes when sign out failed
        await setCookies('user_logged_in')
        setGlobalError('Sign out has failed')
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [user, router])

  const value = {
    user,
    todos,
    completedTodos,
    labels,
    setGlobalError,
    globalError,
    setView,
    view,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider')
  }
  return context
}
