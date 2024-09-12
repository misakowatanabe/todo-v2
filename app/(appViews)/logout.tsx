'use client'

import { useAppContext } from 'app/appContext'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCookies } from 'app/actions'
import { ListItem } from './listItem'
import { Alert } from 'components/Alert'

export function Logout() {
  const { user } = useAppContext()
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const onSignout = async (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.preventDefault()

    try {
      await signOut(auth)
      await deleteCookies('user_logged_in')
      router.push('/signin')
    } catch (error) {
      setError('Failed to sign out.')
    }
  }

  const LabelIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g fill="none" fillRule="evenodd">
        <path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h5M15 3h6v6M10 14L20.2 3.8" />
      </g>
    </svg>
  )

  return (
    <div className="flex flex-col justify-between">
      <div>
        {/* TODO: move this error to global error */}
        <Alert severity="critical" message={error} onClose={() => setError(null)} />
        <ListItem label="Logout" icon={LabelIcon} onClick={onSignout} />
      </div>
      {/* TODO: move this to settings view */}
      <div>
        <div>User name: {!user ? '******' : user.displayName}</div>
        <div>User email: {!user ? '******' : user.email}</div>
      </div>
    </div>
  )
}
