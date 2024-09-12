'use client'

import { useAppContext } from 'app/appContext'
import { useMemo, useState, useTransition } from 'react'
import { Todo } from 'app/actions'
import { Chip, ChipColor } from 'components/Chip'
import { Drawer } from 'components/Drawer'
import { Button } from 'components/Button'
import { Dropdown } from 'components/Dropdown'
import { Textarea } from 'components/Textarea'
import { updateTodo } from './updateTodo'
import { Alert } from 'components/Alert'

type TodoDetailProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedTodo: Todo | null
  labels: string[]
  setLabels: React.Dispatch<React.SetStateAction<string[]>>
  formRef: React.RefObject<HTMLFormElement>
}

export function TodoDetail({
  isOpen,
  setIsOpen,
  selectedTodo,
  labels,
  setLabels,
  formRef,
}: TodoDetailProps) {
  const { labels: availableLabels, user } = useAppContext()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const onSubmitTodo = async (formData: FormData) => {
    if (!selectedTodo) return

    // TODO: add validation for mandatory inputs
    const todo: Omit<Todo, 'createdAt'> = {
      todoId: selectedTodo.todoId,
      title: (formData.get('title') ?? '<No title>') as string,
      body: !formData.get('body') ? undefined : (formData.get('body') as string),
      labels: labels,
      completed: false,
    }

    if (!user) return

    startTransition(async () => {
      const res = await updateTodo(user.uid, todo)

      if (!res.ok) {
        setError(res.error)
      } else {
        setIsOpen(false)

        if (!formRef.current) return

        formRef.current.reset()
      }
    })
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

  const onRemove = (item: string) => {
    setLabels((prev) => prev.filter((el) => el !== item))
  }

  const plusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-labelledby="title-ac01 desc-ac01"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )

  return (
    <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="my-8">
        <div className="flex flex-col gap-6">
          <Alert severity="critical" message={error} onClose={() => setError(null)} />
          <form
            autoComplete="off"
            action={onSubmitTodo}
            className="flex flex-col gap-6"
            id="form-task"
            ref={formRef}
          >
            <Textarea
              size="large"
              name="title"
              placeholder="Task title"
              disabled={isPending}
              rows={1}
              defaultValue={selectedTodo?.title}
            />
            <Textarea
              name="body"
              placeholder="Add description..."
              defaultValue={selectedTodo?.body}
              disabled={isPending}
              rows={6}
            />
          </form>
          <div className="flex flex-col gap-4">
            <div className="text-sm text-gray-500">Labels</div>
            <div className="flex flex-wrap gap-2">
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
          <div className="flex gap-4">
            {selectedTodo && !selectedTodo.completed && (
              <Button
                type="submit"
                label={isPending ? 'Saving...' : 'Save'}
                disabled={isPending}
                form="form-task"
              />
            )}
            <Button
              onClick={() => setIsOpen(false)}
              style="text"
              label={selectedTodo?.completed ? 'Close' : 'Cancel'}
              aria-label="Side drawer"
              aria-controls="basic-drawer"
            />
          </div>
        </div>
      </div>
    </Drawer>
  )
}
