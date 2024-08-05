'use client'

import { useFirebaseContext } from 'app/appContext'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { Button } from 'components/Button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCookies } from 'app/actions'

export default function Header() {
  const { user } = useFirebaseContext()
  const [error, setError] = useState(false)

  const router = useRouter()

  const onSignout = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()

    try {
      await signOut(auth)
      await deleteCookies('currentUser')
      router.push('/signin')
    } catch (error) {
      setError(true)
      console.error('Error signing out: ', error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <div className="bg-gray-400 flex justify-between">
      <div>
        <div>User name: {!user ? '******' : user.displayName}</div>
        <div>User email: {!user ? '******' : user.email}</div>
      </div>
      <div className="flex">
        {error && (
          <div className="flex items-center text-red-700">
            <div>Failed to signout</div>
            <Button
              type="button"
              style="text"
              size="small"
              label="OK"
              onClick={() => setError(false)}
            />
          </div>
        )}
        <Button onClick={onSignout} label="Signout" />
      </div>
    </div>
  )
}
