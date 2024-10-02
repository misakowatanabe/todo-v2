'use client'

import { Label, useAppContext } from 'app/appContext'
import { useMemo, useState, useTransition } from 'react'
import { Todo } from 'app/actions'
import { Chip, ChipColor } from 'components/Chip'
import { Drawer } from 'components/Drawer'
import { Button } from 'components/Button'
import { Dropdown } from 'components/Dropdown'
import { Textarea } from 'components/Textarea'
import { updateTodo } from './updateTodo'
import { Alert } from 'components/Alert'
import { Icon } from 'components/icons'
import { ModalFull } from 'components/ModalFull'

type ContentsProps = {
  isMobile?: boolean
  error: string | null
  setError: React.Dispatch<React.SetStateAction<string | null>>
  onSubmitTodo: (_formData: FormData) => Promise<void>
  formRef: React.RefObject<HTMLFormElement>
  isPending: boolean
  selectedTodo: Todo | null
  setLabels: React.Dispatch<React.SetStateAction<string[]>>
  selectedLabels: Label[]
  nonSelectedLabels: string[]
}

type TodoDetailProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedTodo: Todo | null
  labels: string[]
  setLabels: React.Dispatch<React.SetStateAction<string[]>>
  formRef: React.RefObject<HTMLFormElement>
}

function Contents({
  isMobile = false,
  error,
  setError,
  onSubmitTodo,
  formRef,
  isPending,
  selectedTodo,
  setLabels,
  selectedLabels,
  nonSelectedLabels,
}: ContentsProps) {
  const onRemove = (item: string) => {
    setLabels((prev) => prev.filter((el) => el !== item))
  }

  return (
    <div className="flex flex-col gap-6">
      <Alert severity="critical" message={error} onClose={() => setError(null)} />
      <form
        autoComplete="off"
        action={onSubmitTodo}
        className="flex flex-col gap-6"
        id={isMobile ? 'form-task-mobile' : 'form-task'}
        ref={formRef}
      >
        <Textarea
          size="large"
          name="title"
          placeholder="Task title"
          disabled={isPending}
          rows={1}
          defaultValue={selectedTodo?.title}
          testid={!isMobile ? 'todo-detail-title' : undefined}
        />
        <Textarea
          name="body"
          placeholder="Add description..."
          defaultValue={selectedTodo?.body}
          disabled={isPending}
          rows={6}
          testid={!isMobile ? 'todo-detail-body' : undefined}
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
            items={nonSelectedLabels as unknown as string[]}
            setItems={setLabels}
            icon={<Icon.Plus size="small" />}
            testid={!isMobile ? 'todo-detail-label-selection' : undefined}
          />
        </div>
      </div>
    </div>
  )
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
    const todo: Todo = {
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

  return (
    <>
      <ModalFull
        isShowing={isOpen}
        setIsShowing={setIsOpen}
        actions={
          <>
            {selectedTodo && !selectedTodo.completed && (
              <Button
                type="submit"
                label={isPending ? 'Saving...' : 'Save'}
                disabled={isPending}
                form="form-task-mobile"
                style="text"
              />
            )}
          </>
        }
        className="lg:hidden"
      >
        <Contents
          isMobile={true}
          error={error}
          setError={setError}
          onSubmitTodo={onSubmitTodo}
          formRef={formRef}
          isPending={isPending}
          selectedTodo={selectedTodo}
          setLabels={setLabels}
          selectedLabels={selectedLabels}
          nonSelectedLabels={nonSelectedLabels}
        />
      </ModalFull>
      <Drawer isOpen={isOpen} setIsOpen={setIsOpen} className="hidden lg:block">
        <div className="my-8 flex flex-col gap-6">
          <Contents
            error={error}
            setError={setError}
            onSubmitTodo={onSubmitTodo}
            formRef={formRef}
            isPending={isPending}
            selectedTodo={selectedTodo}
            setLabels={setLabels}
            selectedLabels={selectedLabels}
            nonSelectedLabels={nonSelectedLabels}
          />
          <div className="flex gap-4">
            {selectedTodo && !selectedTodo.completed && (
              <Button
                type="submit"
                label={isPending ? 'Saving...' : 'Save'}
                disabled={isPending}
                form="form-task"
                testid="update-todo-submit"
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
      </Drawer>
    </>
  )
}
