'use server'

import { cookies } from 'next/headers'

export type Todo = {
  todoId: string
  title: string
  body?: string
  labels?: string[]
  completed: boolean
}

/** Data passed from server component to client one must be serializable.
 * https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values
 */

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
