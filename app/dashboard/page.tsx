'use client'

import Data from './data'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import CreateTodo from './createTodo'

export default function Page() {
  const router = useRouter()

  const onSignout = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()

    try {
      await signOut(auth)
      router.push('/signin')
    } catch (error) {
      // TODO: redirect to error page
      // or use error boundary
    }
  }

  return (
    <>
      <CreateTodo />
      <Data />
      <button onClick={onSignout}>Signout</button>
    </>
  )
}
