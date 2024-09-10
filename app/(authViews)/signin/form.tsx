'use client'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'app/firebase'
import { useId } from 'react'
import { Button } from 'components/Button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setCookies } from 'app/actions'
import { Input } from 'components/Input'

export function Form() {
  const [error, setError] = useState(false)
  const emailInputId = useId()
  const passwordInputId = useId()

  const router = useRouter()

  const onSubmit = async (formData: FormData) => {
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
      await setCookies('user_logged_in')
      router.push('/all')
    } catch (error) {
      setError(true)
      console.error('Error signing in: ', error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <>
      <form action={onSubmit} autoComplete="off" className="flex flex-col">
        <Input label="Email" name="email" type="email" required={true} id={emailInputId} />
        <Input
          label="Password"
          name="password"
          type="password"
          required={true}
          id={passwordInputId}
        />
        <Button type="submit" label="Sign in" className="my-4" />
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
