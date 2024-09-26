'use client'

import { useAppContext } from 'app/appContext'
import { useEffect, useRef, useState } from 'react'
import { Todo } from 'app/actions'
import { TodoDetail } from '../todoDetail'
import { DeleteTodoModal } from '../deleteTodoModal'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from 'app/firebase'
import { TodoListLayout } from 'app/(appViews)/(todo)/todoListLayout'

export function TodoList() {
  const { todos, completedTodos, user, view } = useAppContext()
  const [localOrderedTodos, setLocalOrderedTodos] = useState<Todo[] | null>(null)
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [labels, setLabels] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTodoToDelete, setSelectedTodoToDelete] = useState<Todo | null>(null)
  const [deleteTodoModalOpen, setDeleteTodoModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const dragItem = useRef('')
  const dragOverItem = useRef('')

  useEffect(() => {
    if (todos == null) {
      setLocalOrderedTodos(null)

      return
    }

    setLocalOrderedTodos(todos)
  }, [todos])

  useEffect(() => {
    if (isOpen) return

    setLabels([])
    setSelectedTodo(null)

    if (!formRef.current) return

    formRef.current.reset()
  }, [isOpen])

  useEffect(() => {
    if (deleteTodoModalOpen) return

    setSelectedTodoToDelete(null)
  }, [deleteTodoModalOpen])

  const dragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    dragItem.current = (e.target as HTMLTableRowElement).id
  }

  const dragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    dragOverItem.current = (e.target as HTMLDivElement).id
  }

  const drop = async () => {
    if (!user || localOrderedTodos == null) return

    const todosCopy = [...localOrderedTodos]
    const dragItemContent = todosCopy.find((el) => el.todoId === dragItem.current)
    const dragOverItemContent = todosCopy.find((el) => el.todoId === dragOverItem.current)

    if (!dragItemContent || !dragOverItemContent) return

    const dragItemContentIndex = todosCopy.indexOf(dragItemContent)
    const dragOverItemContentIndex = todosCopy.indexOf(dragOverItemContent)
    todosCopy.splice(dragItemContentIndex, 1)
    todosCopy.splice(dragOverItemContentIndex, 0, dragItemContent)

    setLocalOrderedTodos(todosCopy)
    const order = todosCopy.map((el) => el.todoId)

    // update order of todos
    try {
      await updateDoc(doc(db, user.uid, 'order'), {
        active: arrayRemove(...order),
      })
      await updateDoc(doc(db, user.uid, 'order'), {
        active: arrayUnion(...order),
      })
    } catch {
      setError(
        'Could not update the todos order, and this local change disappears once you refresh the page. The todos might not exist.',
      )
    }

    dragItem.current = ''
    dragOverItem.current = ''
  }

  const openTodo = (todo: Todo) => {
    setIsOpen(true)
    setSelectedTodo(todo)

    if (todo.labels) setLabels(todo.labels)
  }

  const openDeleteTodoModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, todo: Todo) => {
    e.stopPropagation()

    setDeleteTodoModalOpen(true)
    setSelectedTodoToDelete(todo)
  }

  return (
    <>
      <TodoListLayout
        setError={setError}
        error={error}
        todos={localOrderedTodos}
        completedTodos={completedTodos}
        view={view}
        dragStart={dragStart}
        dragEnter={dragEnter}
        drop={drop}
        openTodo={openTodo}
        openDeleteTodoModal={openDeleteTodoModal}
      />
      <TodoDetail
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedTodo={selectedTodo}
        labels={labels}
        setLabels={setLabels}
        formRef={formRef}
      />
      {selectedTodoToDelete && (
        <DeleteTodoModal
          deleteTodoModalOpen={deleteTodoModalOpen}
          setDeleteTodoModalOpen={setDeleteTodoModalOpen}
          selectedTodoToDelete={selectedTodoToDelete}
        />
      )}
    </>
  )
}
