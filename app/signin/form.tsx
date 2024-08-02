'use client'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useId } from 'react'
import { Button } from 'components/Button'
import { useState } from 'react'

export default function Form() {
  const [error, setError] = useState(false)
  const emailInputId = useId()
  const passwordInputId = useId()

  const onSubmit = async (formData: FormData) => {
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
    } catch (error) {
      setError(true)
      console.error('Error signing in', error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <>
      <form action={onSubmit} autoComplete="off" className="flex flex-col">
        <label htmlFor={emailInputId}>Email:</label>
        <input id={emailInputId} type="email" name="email" required />
        <label htmlFor={passwordInputId}>Password:</label>
        <input id={passwordInputId} type="password" name="password" required />
        <Button type="submit" label="Submit" />
      </form>
      {error && (
        <div className="flex items-center text-red-700">
          <div>Failed to signin</div>
          <Button
            type="button"
            style="text"
            size="small"
            label="OK"
            onClick={() => setError(false)}
          />
        </div>
      )}
    </>
  )
}
