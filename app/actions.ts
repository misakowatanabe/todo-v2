'use server'

import { ENDPOINT } from 'app/config'
import { cookies } from 'next/headers'
import { ChipColor } from 'components/Chip'

export type Todo = {
  todoId: string
  title: string
  body?: string
  createdAt: string
  labels?: string[]
  completed: boolean
}

export type Label = {
  label: string
  color: ChipColor
}

/** Data passed from server component to client one must be serializable.
 * https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values
 */

export async function create(todo: Todo) {
  const res = await fetch(`${ENDPOINT}/create`, {
    method: 'POST',
    body: JSON.stringify(todo),
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  })

  if (!res.ok) {
    const error = await res.text()
    console.error(error)
  }

  return res.ok
}

export async function sendIdToken(idToken: string) {
  const res = await fetch(`${ENDPOINT}/sendIdToken`, {
    method: 'POST',
    body: JSON.stringify({ idToken: idToken }),
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  })

  return res.ok
}

type userData = { idToken: string; displayName: string }

export async function updateUser(userData: userData) {
  const res = await fetch(`${ENDPOINT}/updateUser`, {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  })

  return res.ok
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

export async function updateOrder(order: string[]) {
  const res = await fetch(`${ENDPOINT}/updateOrder`, {
    method: 'POST',
    body: JSON.stringify({ order: order }),
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  })

  return res.ok
}

export async function createLabel(label: Label): Promise<{
  ok: boolean
  error: string
}> {
  const res = await fetch(`${ENDPOINT}/createLabel`, {
    method: 'POST',
    body: JSON.stringify(label),
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
