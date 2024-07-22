'use client'

import React, { useId } from 'react'
import { format } from 'date-fns'
import { nanoid } from 'nanoid'
import { useFirebaseContext } from '../../appContext'
import { Button } from 'components/Button'
import { create } from 'app/api/route'

export default function CreateTodo() {
  const { user } = useFirebaseContext()
  const titleInputId = useId()
  const bodyInputId = useId()

  const onSubmitTodo = async (formData: FormData) => {
    if (!user) return

    const date = format(new Date(), 'yyyy-MM-dd')
    const id = nanoid(8)

    const todo = {
      userUid: user.uid,
      todoId: id,
      title: (formData.get('title') ?? '<No title>') as string,
      body: (formData.get('body') ?? '<No body>') as string,
      createdAt: date,
    }

    const res = await create(todo)

    // check if create succedded
    if (!res.ok) {
      throw new Error('Failed to get response from database')
    }
  }

  return (
    <div>
      <form autoComplete="off" action={onSubmitTodo}>
        <label htmlFor={titleInputId}>Title:</label>
        <input id={titleInputId} name="title" type="text" />
        <label htmlFor={bodyInputId}>Body:</label>
        <input id={bodyInputId} name="body" type="text" />
        <Button type="reset" label="Reset form" style="text" />
        <Button type="submit" label="Create Todo" />
      </form>
    </div>
  )
}
