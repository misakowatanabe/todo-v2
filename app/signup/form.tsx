'use client'

import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useId } from 'react'
import { Button } from 'components/Button'
import { useState } from 'react'
import { updateUser } from 'app/actions'
import { format } from 'date-fns'
import { nanoid } from 'nanoid'
import { create } from 'app/actions'
import { useRouter } from 'next/navigation'
import { setCookies } from 'app/actions'

type Data = {
  name: string
  email: string
  password: string
  confirmationPassword: string
}

export default function Form() {
  const [error, setError] = useState(false)
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
      setError(true)
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
      const userData = { userUid: userCredential.user.uid, displayName: data.name }
      await updateUser(userData)
      await userCredential.user.reload()
      await setCookies('currentUser')
      router.push('/dashboard')

      // create a welcome todo
      const date = format(new Date(), 'yyyy-MM-dd')
      const id = nanoid(8)

      const todo = {
        userUid: userCredential.user.uid,
        todoId: id,
        title: 'Welcome!',
        body: 'Happy todo listing :)',
        createdAt: date,
      }

      await create(todo)
      router.push('/dashboard')
    } catch (error) {
      setError(true)
      console.error('Error signing in', error instanceof Error ? error.message : String(error))
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
          <div>Failed to signup</div>
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
