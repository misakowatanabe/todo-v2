'use server'

import { ENDPOINT } from 'app/config'
import { cookies } from 'next/headers'

export type Todo = {
  todoId: string
  title: string
  body?: string
  createdAt: string
  labels?: string[]
  completed: boolean
}

export type DeleteInfo = {
  todoId: Pick<Todo, 'todoId'>
  completed: Pick<Todo, 'completed'>
}

/** Data passed from server component to client one must be serializable.
 * https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values
 */

export async function deleteCompletedTodos() {
  const res = await fetch(`${ENDPOINT}/deleteCompleted`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  })

  if (!res.ok) {
    const error = await res.text()

    return { ok: false, error: error }
  }

  return { ok: true, error: '' }
}

export async function tickTodo(todoId: Pick<Todo, 'todoId'>) {
  const res = await fetch(`${ENDPOINT}/tick`, {
    method: 'PUT',
    body: JSON.stringify({ todoId: todoId }),
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  })

  if (!res.ok) {
    const error = await res.text()

    return { ok: false, error: error }
  }

  return { ok: true, error: '' }
}

export async function untickTodo(todoId: Pick<Todo, 'todoId'>) {
  const res = await fetch(`${ENDPOINT}/untick`, {
    method: 'PUT',
    body: JSON.stringify({ todoId: todoId }),
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  })

  if (!res.ok) {
    const error = await res.text()

    return { ok: false, error: error }
  }

  return { ok: true, error: '' }
}

export async function deleteAccount() {
  const res = await fetch(`${ENDPOINT}/deleteAccount`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  })

  if (!res.ok) {
    const error = await res.text()

    return { ok: false, error: error }
  }

  return { ok: true, error: '' }
}

export async function setCookies(name: string) {
  const hasCookie = cookies().get(name)?.value

  if (!hasCookie) {
    const oneDay = 24 * 60 * 60 * 1000
    cookies().set(name, 'true', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: Date.now() + oneDay,
    })
  }

  return true
}

export async function deleteCookies(name: string) {
  cookies().delete(name)

  return true
}

export async function getCookies(name: string) {
  return cookies().get(name)?.value
}
