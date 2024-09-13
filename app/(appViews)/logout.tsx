'use client'

import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCookies } from 'app/actions'
import { ListItem } from './listItem'
import { Alert } from 'components/Alert'
import { Icon } from 'components/icons'

export function Logout() {
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

  return (
    <div>
      {/* TODO: move this error to global error */}
      <Alert severity="critical" message={error} onClose={() => setError(null)} />
      <ListItem label="Logout" icon={<Icon.Escape size="medium" />} onClick={onSignout} />
    </div>
  )
}
