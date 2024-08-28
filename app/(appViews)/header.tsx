'use client'

import { useAppContext } from 'app/appContext'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { Button } from 'components/Button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCookies } from 'app/actions'

export default function Header() {
  const { user } = useAppContext()
  const [error, setError] = useState(false)

  const router = useRouter()

  const onSignout = async (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.preventDefault()

    try {
      await signOut(auth)
      await deleteCookies('user_logged_in')
      router.push('/signin')
    } catch (error) {
      setError(true)
      console.error('Error signing out: ', error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <div className="flex flex-col justify-between">
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
        <div className="flex justify-between items-center group h-12 px-3 hover:bg-gray-100 rounded gap-1 w-full">
          <div className="flex justify-start gap-3 w-full items-center" onClick={onSignout}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g fill="none" fill-rule="evenodd">
                <path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h5M15 3h6v6M10 14L20.2 3.8" />
              </g>
            </svg>
            <div>Logout</div>
          </div>
        </div>
      </div>
      <div>
        <div>User name: {!user ? '******' : user.displayName}</div>
        <div>User email: {!user ? '******' : user.email}</div>
      </div>
    </div>
  )
}
