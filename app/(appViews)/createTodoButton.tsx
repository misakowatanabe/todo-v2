'use client'

import React, { useEffect, useMemo, useState, useTransition } from 'react'
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
import { Fab } from 'components/Fab'
import { ModalFull } from 'components/ModalFull'

type SubmitProps = { isPending: boolean; isMobile: boolean }

function Submit({ isPending, isMobile }: SubmitProps) {
  return (
    <Button
      style={isMobile ? 'text' : 'primary'}
      type="submit"
      label={isPending ? 'Creating...' : 'Create'}
      disabled={isPending}
      form="form-new-task"
      testid="create-todo-submit"
    />
  )
}

type CreateTodoButtonProps = { isMobile?: boolean }

export function CreateTodoButton({ isMobile = false }: CreateTodoButtonProps) {
  const { labels: availableLabels, user } = useAppContext()
  const [error, setError] = useState<null | string>(null)
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
        setError(null)
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

  const initialFocusId = 'task-title'

  const contents = (
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
          id={initialFocusId}
          name="title"
          placeholder="Task title"
          disabled={isPending}
          rows={1}
          testid="create-todo-title"
        />
        <Textarea
          name="body"
          placeholder="Add description..."
          disabled={isPending}
          rows={6}
          testid="create-todo-body"
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
  )

  if (isMobile)
    return (
      <ModalFull
        openButton={<Fab icon={<Icon.Plus />} onClick={() => setIsShowing(true)} size="large" />}
        isShowing={isShowing}
        setIsShowing={setIsShowing}
        actions={<Submit isPending={isPending} isMobile={isMobile} />}
        initialFocusId={initialFocusId}
      >
        {contents}
      </ModalFull>
    )

  return (
    <Modal
      title="New task"
      setIsShowing={setIsShowing}
      isShowing={isShowing}
      openButton={
        <Button
          onClick={() => setIsShowing(true)}
          label="New task"
          icon={<Icon.Plus />}
          style="secondary"
          size="large"
          className="w-full"
          testid="create-todo"
        />
      }
      okButton={<Submit isPending={isPending} isMobile={isMobile} />}
      initialFocusId={initialFocusId}
    >
      {contents}
    </Modal>
  )
}
