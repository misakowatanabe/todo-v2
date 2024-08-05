'use client'

import { useFirebaseContext } from 'app/appContext'

export default function GlobalAlert() {
  const { globalError } = useFirebaseContext()

  return <div className="text-red-700">{globalError}</div>
}
