'use client'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'app/firebase'
import { useTransition } from 'react'
import { Button } from 'components/Button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setCookies } from 'app/actions'
import { Input } from 'components/Input'
import { Alert } from 'components/Alert'

export function Form() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [inputs, setInputs] = useState<{ email: null | string; password: null | string }>({
    email: null,
    password: null,
  })

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
        setError('Error! Please check your password and email address.')
      }
    })
  }

  const disabled = isPending || inputs.email === null || inputs.password === null

  return (
    <>
      <Alert severity="critical" message={error} onClose={() => setError(null)} className="mb-4" />
      <form action={onSubmit} autoComplete="off" className="group flex flex-col" noValidate={true}>
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="off"
          testid="sign-in-input-email"
          validationMessage="Please enter a valid email address"
          onChange={(e) =>
            setInputs((prev) => {
              const value = e.target.value === '' ? null : e.target.value
              return { email: value, password: prev.password }
            })
          }
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="off"
          testid="sign-in-input-password"
          onChange={(e) =>
            setInputs((prev) => {
              const value = e.target.value === '' ? null : e.target.value
              return { email: prev.email, password: value }
            })
          }
        />
        <Button
          type={!disabled ? 'submit' : 'button'}
          label={isPending ? 'Processing...' : 'Sign in'}
          className="my-4 group-invalid:text-white group-invalid:bg-[#b3b3b3] group-invalid:cursor-not-allowed group-invalid:pointer-events-none"
          disabled={disabled}
          data-testid="sign-in-submit"
        />
      </form>
    </>
  )
}
