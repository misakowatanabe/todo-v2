'use client'

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from 'app/firebase'
import { useTransition } from 'react'
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
  const [inputs, setInputs] = useState<{
    name: null | string
    email: null | string
    password: null | string
    passwordConfirmation: null | string
  }>({
    name: null,
    email: null,
    password: null,
    passwordConfirmation: null,
  })

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
        setError(
          'Error! Please check your password and email address. The account might already exist or the password might be invalid',
        )
      }
    })
  }

  const disabled =
    isPending ||
    inputs.name === null ||
    inputs.email === null ||
    inputs.password === null ||
    inputs.passwordConfirmation === null

  return (
    <>
      <Alert severity="critical" message={error} onClose={() => setError(null)} className="mb-4" />
      <form action={onSubmit} autoComplete="off" className="group flex flex-col">
        <Input
          label="Name"
          name="name"
          type="text"
          testid="sign-up-input-name"
          onChange={(e) =>
            setInputs((prev) => {
              const value = e.target.value === '' ? null : e.target.value
              return {
                name: value,
                email: prev.email,
                password: prev.password,
                passwordConfirmation: prev.passwordConfirmation,
              }
            })
          }
        />
        <Input
          label="Email"
          name="email"
          type="email"
          testid="sign-up-input-email"
          validationMessage="Please enter a valid email address"
          onChange={(e) =>
            setInputs((prev) => {
              const value = e.target.value === '' ? null : e.target.value
              return {
                name: prev.name,
                email: value,
                password: prev.password,
                passwordConfirmation: prev.passwordConfirmation,
              }
            })
          }
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="off"
          testid="sign-up-input-password"
          onChange={(e) =>
            setInputs((prev) => {
              const value = e.target.value === '' ? null : e.target.value
              return {
                name: prev.name,
                email: prev.email,
                password: value,
                passwordConfirmation: prev.passwordConfirmation,
              }
            })
          }
        />
        <Input
          label="Confirm password"
          name="confirmationPassword"
          type="password"
          autoComplete="off"
          testid="sign-up-input-password-confirmation"
          onChange={(e) =>
            setInputs((prev) => {
              const value = e.target.value === '' ? null : e.target.value
              return {
                name: prev.name,
                email: prev.email,
                password: prev.password,
                passwordConfirmation: value,
              }
            })
          }
        />
        <Button
          type={!disabled ? 'submit' : 'button'}
          label={isPending ? 'Processing...' : 'Sign up'}
          className="my-4 group-invalid:text-white group-invalid:bg-[#b3b3b3] group-invalid:cursor-not-allowed group-invalid:pointer-events-none"
          disabled={disabled}
          testid="sign-up-submit"
        />
      </form>
    </>
  )
}
