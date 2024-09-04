'use client'

import { useEffect, useState } from 'react'

export type View = 'table' | 'card'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const localstorageValue = localStorage.getItem(key)

    if (localstorageValue !== null) {
      setValue(JSON.parse(localstorageValue) as T)
    }
    setIsInitialized(true)
  }, [key])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }, [isInitialized, key, value])

  return [value, setValue] as const
}

// export const useLocalStorage = (storageKey: string, fallbackState: View) => {
//   //   const [value, setValue] = useState(
//   //     localStorage.getItem(storageKey)
//   //       ? JSON.parse(localStorage.getItem(storageKey))
//   //       : String(fallbackState),
//   //   )

//   //   const [value, setValue] = useState<string>(
//   //     JSON.parse(localStorage.getItem(storageKey)) ?? fallbackState,
//   //   )

//   //   const [value, setValue] = useState<string>(
//   //     JSON.parse(localStorage.getItem(storageKey) || String(fallbackState)) ?? fallbackState,
//   //   )

//   const [value, setValue] = useState(() => {
//     let currentValue

//     try {
//       currentValue = JSON.parse(localStorage.getItem(storageKey) || fallbackState)
//     } catch (error) {
//       currentValue = fallbackState
//     }

//     return currentValue
//   })

//   useEffect(() => {
//     localStorage.setItem(storageKey, JSON.stringify(value))
//   }, [value, storageKey])

//   return [value, setValue]
// }
