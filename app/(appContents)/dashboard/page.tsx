'use client'

import Todo from './todo'
import { auth } from '../../firebase'
import { signOut } from 'firebase/auth'
import CreateTodo from './createTodo'
import { Button } from 'components/Button'

export default function Page() {
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
    <>
      <div>Dashboard</div>
      <CreateTodo />
      <Todo />
      <Button onClick={onSignout} label="Signout" />
    </>
  )
}
