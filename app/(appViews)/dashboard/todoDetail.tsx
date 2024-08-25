'use client'

import { useAppContext } from 'app/appContext'
import { useMemo, useState, useTransition } from 'react'
import { Todo, update } from 'app/actions'
import { Chip, ChipColor } from 'components/Chip'
import Drawer from 'components/Drawer'
import { Button } from 'components/Button'
import { Dropdown } from 'components/Dropdown'
import { Textarea } from 'components/Textarea'

type TodoDetailProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedTodo: Todo
  labels: string[]
  setLabels: React.Dispatch<React.SetStateAction<string[]>>
}

export default function TodoDetail({
  isOpen,
  setIsOpen,
  selectedTodo,
  labels,
  setLabels,
}: TodoDetailProps) {
  const { labels: availableLabels } = useAppContext()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const onSubmitTodo = async (formData: FormData) => {
    setError(null)
    if (!selectedTodo) return

    // TODO: add validation for mandatory inputs
    const todo: Omit<Todo, 'createdAt'> = {
      todoId: selectedTodo.todoId,
      title: (formData.get('title') ?? '<No title>') as string,
      body: !formData.get('body') ? undefined : (formData.get('body') as string),
      labels: labels,
      completed: false,
    }

    startTransition(async () => {
      const res = await update(todo)

      if (!res.ok) {
        setError(res.error)
      } else {
        setIsOpen(false)
      }
    })
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
      strokeWidth="1.5"
      aria-labelledby="title-ac01 desc-ac01"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )

  return (
    <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
      {error && (
        <div className="flex labels-center text-red-700">
          <div>{error}</div>
          <Button
            type="button"
            style="text"
            size="small"
            label="OK"
            onClick={() => setError(null)}
          />
        </div>
      )}
      <div className="flex flex-col gap-6">
        <form
          autoComplete="off"
          action={onSubmitTodo}
          className="flex flex-col gap-2"
          id="form-task"
        >
          <input
            name="title"
            type="text"
            placeholder="Task title"
            defaultValue={selectedTodo.title}
            disabled={isPending}
          />
          <Textarea
            name="body"
            placeholder="Add description..."
            defaultValue={selectedTodo.body}
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
          <Button
            type="submit"
            label={isPending ? 'Saving...' : 'Save'}
            disabled={isPending}
            form="form-task"
          />
          <Button
            onClick={() => setIsOpen(false)}
            style="text"
            label="Cancel"
            aria-label="Side drawer"
            aria-controls="basic-drawer"
          />
        </div>
      </div>
    </Drawer>
  )
}
