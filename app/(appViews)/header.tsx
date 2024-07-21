'use client'

import { useFirebaseContext } from 'app/appContext'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { Button } from 'components/Button'

export default function Header() {
  const { user } = useFirebaseContext()

  const onSignout = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()

    try {
      await signOut(auth)
    } catch (error) {
      // TODO: redirect to error page
      // or use error boundary
    }
  }

  return (
    <div className="bg-gray-400 flex justify-between">
      <div>
        <div>User name: {user?.displayName}</div>
        <div>User email: {user?.email}</div>
      </div>
      <Button onClick={onSignout} label="Signout" />
    </div>
  )
}
