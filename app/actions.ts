'use server'

import { ENDPOINT } from 'app/config'

type Todo = {
  userUid: string
  todoId: string
  title: string
  body: string
  createdAt: string
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

  return res.ok
}

export type Uid = {
  userUid: string
}

export async function sendUserId(userUid: Uid) {
  const res = await fetch(`${ENDPOINT}/catch-user-uid`, {
    method: 'POST',
    body: JSON.stringify(userUid),
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  })

  return res.ok
}

type userData = { userUid: string; displayName: string }

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
