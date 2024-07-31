'use client'

import React, { useId, useState } from 'react'
import { format } from 'date-fns'
import { nanoid } from 'nanoid'
import { useFirebaseContext } from '../../appContext'
import { Button } from 'components/Button'
import { create } from 'app/actions'

export default function CreateTodo() {
  const { user } = useFirebaseContext()
  const [error, setError] = useState(false)
  const titleInputId = useId()
  const bodyInputId = useId()

  const onSubmitTodo = async (formData: FormData) => {
    if (!user) return

    setError(false)
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

    // This checks if create action succeeded
    if (!res) {
      setError(true)
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
      {error && (
        <div className="flex items-center text-red-700">
          <div>Failed to create a todo</div>
          <Button
            type="button"
            style="text"
            size="small"
            label="OK"
            onClick={() => setError(false)}
          />
        </div>
      )}
    </div>
  )
}
