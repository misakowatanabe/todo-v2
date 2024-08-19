'use client'

import React, { useId, useMemo, useState } from 'react'
import { useAppContext } from 'app/appContext'
import { format } from 'date-fns'
import { nanoid } from 'nanoid'
import { Button } from 'components/Button'
import { Chip, ChipColor } from 'components/Chip'
import { Dropdown } from 'components/Dropdown'
import { Todo, create } from 'app/actions'

export default function CreateTodo() {
  const { labels: availableLabels } = useAppContext()
  const [error, setError] = useState(false)
  const titleInputId = useId()
  const bodyInputId = useId()
  const [labels, setLabels] = useState<string[]>([])

  const onSubmitTodo = async (formData: FormData) => {
    setError(false)
    const date = format(new Date(), 'yyyy-MM-dd')
    const id = nanoid(8)

    // TODO: add validation for mandatory inputs
    const todo: Todo = {
      todoId: id,
      title: (formData.get('title') ?? '<No title>') as string,
      body: !formData.get('body') ? undefined : (formData.get('body') as string),
      createdAt: date,
      labels: labels,
      completed: false,
    }

    const resOk = await create(todo)

    // This checks if create action succeeded
    if (!resOk) {
      setError(true)
    }

    setLabels([])
    // TODO: clear all inputs
  }

  const onRemove = (item: string) => {
    setLabels((prev) => prev.filter((el) => el !== item))
  }

  const nonSelectedLabels = useMemo(() => {
    const nonSelected = availableLabels.filter((el) => !labels.includes(el.label))

    return nonSelected.map((el) => el.label)
  }, [availableLabels, labels])

  const selectedLabels = useMemo(() => {
    const selected = availableLabels.filter((el) => labels.includes(el.label))
    selected.sort((a, b) => {
      return labels.indexOf(a.label) - labels.indexOf(b.label)
    })

    return selected
  }, [availableLabels, labels])

  return (
    <div>
      Label:
      {selectedLabels.map((el, idx) => (
        <Chip
          key={idx}
          label={el.label}
          onRemove={() => onRemove(el.label)}
          color={el.color as ChipColor}
        />
      ))}
      <Dropdown label="Add label" items={nonSelectedLabels} setItems={setLabels} />
      <form autoComplete="off" action={onSubmitTodo}>
        <label htmlFor={titleInputId}>Title:</label>
        <input id={titleInputId} name="title" type="text" />
        <label htmlFor={bodyInputId}>Body:</label>
        <input id={bodyInputId} name="body" type="text" />
        <Button type="reset" label="Reset form" style="text" />
        <Button type="submit" label="Create Todo" />
      </form>
      {error && (
        <div className="flex labels-center text-red-700">
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
