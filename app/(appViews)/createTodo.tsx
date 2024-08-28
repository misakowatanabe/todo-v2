'use client'

import React, { useEffect, useId, useMemo, useState, useTransition } from 'react'
import { useAppContext } from 'app/appContext'
import { format } from 'date-fns'
import { nanoid } from 'nanoid'
import { Button } from 'components/Button'
import { Chip, ChipColor } from 'components/Chip'
import { Dropdown } from 'components/Dropdown'
import Modal from 'components/Modal'
import { Todo, create } from 'app/actions'

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

export default function CreateTodo() {
  const { labels: availableLabels } = useAppContext()
  const [error, setError] = useState(false)
  const titleInputId = useId()
  const bodyInputId = useId()
  const [labels, setLabels] = useState<string[]>([])
  const [isShowing, setIsShowing] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!isShowing) setLabels([])
  }, [isShowing])

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

    startTransition(async () => {
      const resOk = await create(todo)

      if (!resOk) {
        setError(true)
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

  const plusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-labelledby="title-ac01 desc-ac01"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )

  const openButton = (
    <Button
      onClick={() => setIsShowing(true)}
      label="New task"
      icon={plusIcon}
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
      <div className="flex flex-col gap-6">
        <form
          autoComplete="off"
          action={onSubmitTodo}
          className="flex flex-col gap-2"
          id="form-new-task"
        >
          <input
            id={titleInputId}
            name="title"
            type="text"
            placeholder="Task title"
            disabled={isPending}
          />
          <input
            id={bodyInputId}
            name="body"
            type="text"
            placeholder="Add description..."
            disabled={isPending}
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
              icon={plusIcon}
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}
