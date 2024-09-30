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
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
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

  const { ...allInputs } = inputs
  const canSubmit = [...Object.values(allInputs)].every(Boolean)

  const disabled = isPending || !canSubmit

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
              return {
                ...prev,
                email: e.target.value,
              }
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
              return {
                ...prev,
                password: e.target.value,
              }
            })
          }
        />
        <Button
          type={!disabled ? 'submit' : 'button'}
          label={isPending ? 'Processing...' : 'Sign in'}
          className="my-4 group-invalid:text-white group-invalid:bg-[#b3b3b3] group-invalid:cursor-not-allowed group-invalid:pointer-events-none"
          disabled={disabled}
          testid="sign-in-submit"
        />
      </form>
    </>
  )
}
