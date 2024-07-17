'use client'

import { useFirebaseContext } from 'app/appContext'

export default function Header() {
  const { user } = useFirebaseContext()

  return (
    <div className="bg-gray-400">
      <div>User name: {user?.displayName}</div>
      <div>User email: {user?.email}</div>
    </div>
  )
}
