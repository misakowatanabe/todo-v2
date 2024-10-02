'use client'

import { Label, useAppContext } from 'app/appContext'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
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

function useAutosizeTextArea(textAreaRef: HTMLTextAreaElement | null, value: string) {
  useEffect(() => {
    if (textAreaRef) {
      textAreaRef.style.height = '0px'

      const borderHeight = 2
      const scrollHeight = textAreaRef.scrollHeight + borderHeight
      textAreaRef.style.height = scrollHeight + 'px'
    }
  }, [textAreaRef, value])
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
  const titleInputRef = useRef<HTMLTextAreaElement | null>(null)
  const bodyInputRef = useRef<HTMLTextAreaElement | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  useAutosizeTextArea(titleInputRef.current, title)
  useAutosizeTextArea(bodyInputRef.current, body)

  useEffect(() => {
    setTitle(selectedTodo?.title ?? '')
    setBody(selectedTodo?.body ?? '')
  }, [selectedTodo])

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
          ref={titleInputRef}
          size="large"
          name="title"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
          rows={1}
          testid={!isMobile ? 'todo-detail-title' : undefined}
        />
        <Textarea
          ref={bodyInputRef}
          name="body"
          placeholder="Add description..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={isPending}
          rows={1}
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

    const title = (formData.get('title') as string).trim()
    if (title === '') {
      setError('Please add title.')

      return
    }

    const todo: Todo = {
      todoId: selectedTodo.todoId,
      title: title,
      body: !formData.get('body') ? undefined : (formData.get('body') as string).trim(),
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
        setError(null)

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
        <div className="my-8">
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
        </div>
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
