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
 *
 * Getting cookies is allowed only in a Server Component, Server Action or Route Handler.
 * Setting/deleting cookies is allowed only in a Server Action or Route Handler.
 * https://nextjs.org/docs/app/api-reference/functions/cookies */

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
}

export async function deleteCookies(name: string) {
  cookies().delete(name)
}

export async function getCookies(name: string) {
  return cookies().get(name)?.value
}
