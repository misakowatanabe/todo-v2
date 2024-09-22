'use client'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'app/firebase'
import { useId, useTransition } from 'react'
import { Button } from 'components/Button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setCookies } from 'app/actions'
import { Input } from 'components/Input'
import { Alert } from 'components/Alert'

export function Form() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const emailInputId = useId()
  const passwordInputId = useId()

  const router = useRouter()

  const onSubmit = async (formData: FormData) => {
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    startTransition(async () => {
      try {
        await signInWithEmailAndPassword(auth, data.email, data.password)
        await setCookies('user_logged_in')
        router.push('/all')
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error))
      }
    })
  }

  return (
    <>
      <Alert severity="critical" message={error} onClose={() => setError(null)} className="mb-4" />
      <form action={onSubmit} autoComplete="off" className="flex flex-col">
        <Input
          label="Email"
          name="email"
          type="email"
          required={true}
          id={emailInputId}
          testid="sign-in-input-email"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          required={true}
          id={passwordInputId}
          autoComplete="off"
          testid="sign-in-input-password"
        />
        <Button
          type="submit"
          label={isPending ? 'Processing...' : 'Sign in'}
          className="my-4"
          disabled={isPending}
          data-testid="sign-in-submit"
        />
      </form>
    </>
  )
}
