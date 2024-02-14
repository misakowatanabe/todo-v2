'use client'

import { ENDPOINT } from '../config'
import React, { useId } from 'react'
import { format } from 'date-fns'
import { nanoid } from 'nanoid'
import { useFirebaseContext } from '../appContext'

type Todo = {
  userUid: string
  todoId: string
  title: string
  body: string
  createdAt: string
}

export default function CreateTodo() {
  const { user } = useFirebaseContext()
  const titleInputId = useId()
  const bodyInputId = useId()

  const onSubmitTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const date = format(new Date(), 'yyyy-MM-dd')
    const id = nanoid(8)

    const todo = {
      userUid: user?.uid,
      todoId: id,
      title: formData.get('title'),
      body: formData.get('body'),
      createdAt: date,
    }

    try {
      const res = await fetch(`${ENDPOINT}/create`, {
        method: 'POST',
        body: JSON.stringify(todo as Todo),
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      })

      res.json().then((res) => {
        if (res.message === 200) {
          // TODO: delete inputs
        } else if (res.message === 500) {
          //
        }
      })
    } catch (error) {
      //
    }
  }

  return (
    <div>
      <form noValidate autoComplete="off" onSubmit={onSubmitTodo}>
        <label htmlFor={titleInputId}>Title:</label>
        <input id={titleInputId} name="title" type="text" />
        <label htmlFor={bodyInputId}>Body:</label>
        <input id={bodyInputId} name="body" type="text" />
        <button type="reset">Reset form</button>
        <button type="submit">Create Todo</button>
      </form>
    </div>
  )
}
