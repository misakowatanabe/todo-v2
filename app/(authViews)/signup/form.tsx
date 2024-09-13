'use client'

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from 'app/firebase'
import { useId, useTransition } from 'react'
import { Button } from 'components/Button'
import { useState } from 'react'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { Todo, setCookies } from 'app/actions'
import { createTodo } from 'app/createTodo'
import { Input } from 'components/Input'
import { Alert } from 'components/Alert'

type Data = {
  name: string
  email: string
  password: string
  confirmationPassword: string
}

export function Form() {
  const [error, setError] = useState<null | string>(null)
  const [isPending, startTransition] = useTransition()
  const nameInputId = useId()
  const emailInputId = useId()
  const passwordInputId = useId()
  const confirmationPasswordInputId = useId()

  const router = useRouter()

  const validateForm = (data: Data) => {
    // TODO: do proper validation
    return (
      data.name.length > 0 &&
      data.password.length > 0 &&
      data.password === data.confirmationPassword
    )
  }

  const onSubmit = async (formData: FormData) => {
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmationPassword: formData.get('confirmationPassword') as string,
    }

    if (!validateForm(data)) {
      // TODO: show what is not validated to user
      setError('Please check if name, email and password are filled in correctly.')
      return
    }

    startTransition(async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
        // TODO: consider removing this not to get a situation where user was created but failed to update displayname
        await updateProfile(userCredential.user, { displayName: data.name })

        // create a welcome todo
        const id = nanoid(8)

        const todo: Todo = {
          todoId: id,
          title: 'Welcome!',
          body: 'Happy todo listing :)',
          completed: false,
        }

        const res = await createTodo(userCredential.user, todo)

        if (!res.ok) {
          throw new Error(
            'Something went wrong with creating a welcome todo! You can still login with your newly created account.',
          )
        }

        await userCredential.user.reload()
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
        <Input label="Name" name="name" type="text" required={true} id={nameInputId} />
        <Input label="Email" name="email" type="email" required={true} id={emailInputId} />
        <Input
          label="Password"
          name="password"
          type="password"
          required={true}
          id={passwordInputId}
        />
        <Input
          label="Confirm password"
          name="confirmationPassword"
          type="password"
          required={true}
          id={confirmationPasswordInputId}
        />
        <Button
          type="submit"
          label={isPending ? 'Processing...' : 'Sign up'}
          className="my-4"
          disabled={isPending}
        />
      </form>
    </>
  )
}
