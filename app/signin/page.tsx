'use client'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useRouter } from 'next/navigation'
import { useId } from 'react'

export default function Signin() {
  const router = useRouter()
  const emailInputId = useId()
  const passwordInputId = useId()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    // TODO: handle errors
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      // setting user is not needed since it's handled on authentication state observer (onAuthStateChanged)
      await signInWithEmailAndPassword(auth, email, password)
      // TODO: check if succesfully signed in
      router.push('/dashboard')
    } catch (error) {
      console.error('Error signing in', error instanceof Error ? error.message : String(error))
    }
  }
  // TODO: Add proper inputs for signing and remove emails
  return (
    <form onSubmit={onSubmit} autoComplete="off">
      <label htmlFor={emailInputId}>Email:</label>
      <input id={emailInputId} type="email" name="email" required />
      <label htmlFor={passwordInputId}>Email:</label>
      <input id={passwordInputId} type="password" name="password" required />
      <button type="submit">Signin</button>
    </form>
  )
}
