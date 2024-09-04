'use client'

import { useAppContext } from 'app/appContext'

export function GlobalAlert() {
  const { globalError } = useAppContext()

  return <div className="text-red-700">{globalError}</div>
}
