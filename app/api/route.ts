import { ENDPOINT } from 'app/config'
import { NextResponse } from 'next/server'

type Todo = {
  userUid: string
  todoId: string
  title: string
  body: string
  createdAt: string
}

export async function create(todo: Todo) {
  try {
    const res = await fetch(`${ENDPOINT}/create`, {
      method: 'POST',
      body: JSON.stringify(todo as Todo),
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    })

    const data = await res.json()

    return Response.json(data)
  } catch (error) {
    throw new Error('Failed to connect to backend, could not create todo')
  }
}

export type Uid = {
  userUid: string
}

export async function sendUserId(userUid: Uid) {
  try {
    const res = await fetch(`${ENDPOINT}/catch-user-uid`, {
      method: 'POST',
      body: JSON.stringify(userUid),
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'no-store',
    })

    return NextResponse.json(res)
  } catch (error) {
    console.error(
      'Error, node.js backend is not available',
      error instanceof Error ? error.message : String(error),
    )
    // This uses global error view (global-error.tsx) in prod
    throw new Error('Failed to connect to backend')
  }
}
