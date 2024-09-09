'use client'

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebase'
import { useId } from 'react'
import { Button } from 'components/Button'
import { useState } from 'react'
import { format } from 'date-fns'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { Todo, setCookies } from 'app/actions'
import { createTodo } from 'app/createTodo'

type Data = {
  name: string
  email: string
  password: string
  confirmationPassword: string
}

export function Form() {
  const [error, setError] = useState<null | string>(null)
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

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
      // TODO: consider removing this not to get a situation where user was created but failed to update displayname
      await updateProfile(userCredential.user, { displayName: data.name })

      // create a welcome todo
      const date = format(new Date(), 'yyyy-MM-dd')
      const id = nanoid(8)

      const todo: Todo = {
        todoId: id,
        title: 'Welcome!',
        body: 'Happy todo listing :)',
        createdAt: date,
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
  }

  return (
    <>
      <form action={onSubmit} autoComplete="off" className="flex flex-col">
        <label htmlFor={nameInputId}>Name:</label>
        <input id={nameInputId} type="text" name="name" required />
        <label htmlFor={emailInputId}>Email:</label>
        <input id={emailInputId} type="email" name="email" required />
        <label htmlFor={passwordInputId}>Password:</label>
        <input id={passwordInputId} type="password" name="password" required />
        <label htmlFor={confirmationPasswordInputId}>Confirm password:</label>
        <input
          id={confirmationPasswordInputId}
          type="password"
          name="confirmationPassword"
          required
        />
        <Button type="submit" label="Submit" />
      </form>
      {error && (
        <div className="flex items-center text-red-700">
          <div>{error}</div>
          <Button
            type="button"
            style="text"
            size="small"
            label="OK"
            onClick={() => setError(null)}
          />
        </div>
      )}
    </>
  )
}
