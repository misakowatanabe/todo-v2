'use client'

import React, { useEffect, useId, useMemo, useState, useTransition } from 'react'
import { useAppContext } from 'app/appContext'
import { nanoid } from 'nanoid'
import { Button } from 'components/Button'
import { Chip, ChipColor } from 'components/Chip'
import { Dropdown } from 'components/Dropdown'
import { Modal } from 'components/Modal'
import { Textarea } from 'components/Textarea'
import { Todo } from 'app/actions'
import { createTodo } from 'app/createTodo'
import { Alert } from 'components/Alert'
import { Icon } from 'components/icons'

type SubmitProps = { isPending: boolean }

function Submit({ isPending }: SubmitProps) {
  return (
    <Button
      type="submit"
      label={isPending ? 'Creating...' : 'Create'}
      disabled={isPending}
      form="form-new-task"
    />
  )
}

export function CreateTodoButton() {
  const { labels: availableLabels, user } = useAppContext()
  const [error, setError] = useState<null | string>(null)
  const titleInputId = useId()
  const bodyInputId = useId()
  const [labels, setLabels] = useState<string[]>([])
  const [isShowing, setIsShowing] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!isShowing) setLabels([])
  }, [isShowing])

  const onSubmitTodo = async (formData: FormData) => {
    setError(null)

    const title = formData.get('title')
    if (title === '') {
      setError('Please add title.')

      return
    }

    const id = nanoid(8)

    const todo: Todo = {
      todoId: id,
      title: title as string,
      body: !formData.get('body') ? undefined : (formData.get('body') as string),
      labels: labels,
      completed: false,
    }

    if (!user) return

    startTransition(async () => {
      const res = await createTodo(user, todo)

      if (!res.ok) {
        setError('Something went wrong! Could not create a todo.')
      } else {
        setIsShowing(false)
        setLabels([])
      }
    })
  }

  const onRemove = (item: string) => {
    setLabels((prev) => prev.filter((el) => el !== item))
  }

  const nonSelectedLabels = useMemo(() => {
    if (availableLabels == null) return []

    const nonSelected = availableLabels.filter((el) => !labels.includes(el.label))

    return nonSelected.map((el) => el.label)
  }, [availableLabels, labels])

  const selectedLabels = useMemo(() => {
    if (availableLabels == null) return []

    const selected = availableLabels.filter((el) => labels.includes(el.label))
    selected.sort((a, b) => {
      return labels.indexOf(a.label) - labels.indexOf(b.label)
    })

    return selected
  }, [availableLabels, labels])

  const openButton = (
    <Button
      onClick={() => setIsShowing(true)}
      label="New task"
      icon={<Icon.Plus />}
      style="secondary"
      size="large"
      className="w-full"
    />
  )

  return (
    <Modal
      title="New task"
      setIsShowing={setIsShowing}
      isShowing={isShowing}
      openButton={openButton}
      okButton={<Submit isPending={isPending} />}
    >
      <div className="flex flex-col gap-6">
        <Alert severity="critical" message={error} onClose={() => setError(null)} />
        <form
          autoComplete="off"
          action={onSubmitTodo}
          className="flex flex-col gap-6"
          id="form-new-task"
        >
          <Textarea
            size="large"
            id={titleInputId}
            name="title"
            placeholder="Task title"
            disabled={isPending}
            rows={1}
          />
          <Textarea
            id={bodyInputId}
            name="body"
            placeholder="Add description..."
            disabled={isPending}
            rows={6}
          />
        </form>
        <div className="flex flex-col gap-4">
          <div className="text-sm text-gray-500">Labels</div>
          <div className="flex gap-2">
            {selectedLabels.map((el, idx) => (
              <Chip
                key={idx}
                label={el.label}
                onRemove={() => onRemove(el.label)}
                color={el.color as ChipColor}
              />
            ))}
            <Dropdown
              label="Add label"
              items={nonSelectedLabels}
              setItems={setLabels}
              icon={<Icon.Plus size="small" />}
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}
