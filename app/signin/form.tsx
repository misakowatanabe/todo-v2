'use client'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useId } from 'react'
import { Button } from 'components/Button'

export default function Form() {
  const emailInputId = useId()
  const passwordInputId = useId()

  const onSubmit = async (formData: FormData) => {
    const rawFormData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    try {
      // setting user is not needed since it's handled on authentication state observer (onAuthStateChanged)
      await signInWithEmailAndPassword(auth, rawFormData.email, rawFormData.password)

      // TODO: check if succesfully signed in
    } catch (error) {
      console.error('Error signing in', error instanceof Error ? error.message : String(error))
    }
  }

  // TODO: Add proper inputs for signing and remove emails
  return (
    <form action={onSubmit} autoComplete="off">
      <label htmlFor={emailInputId}>Email:</label>
      <input id={emailInputId} type="email" name="email" required />
      <label htmlFor={passwordInputId}>Password:</label>
      <input id={passwordInputId} type="password" name="password" required />
      <Button type="submit" label="Submit" />
    </form>
  )
}
