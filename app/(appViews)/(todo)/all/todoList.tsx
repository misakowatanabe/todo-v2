'use client'

import { useAppContext } from 'app/appContext'
import { useEffect, useRef, useState } from 'react'
import { Todo } from 'app/actions'
import { TodoDetail } from '../todoDetail'
import { DeleteTodoModal } from '../DeleteTodoModal'
import { TodoListItem, View } from '../todoListItem'
import { Heading } from 'components/Heading'
import { Accordion } from 'components/Accordion'
import { Button } from 'components/Button'
import { HeadingActions } from '../headingActions'
import { useLocalStorage } from 'utils/useLocalStorage'
import clsx from 'clsx'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from 'app/firebase'

export function TodoList() {
  const { todos, completedTodos, user } = useAppContext()
  const [localOrderedTodos, setLocalOrderedTodos] = useState<Todo[]>([])
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [labels, setLabels] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTodoToDelete, setSelectedTodoToDelete] = useState<Todo | null>(null)
  const [deleteTodoModalOpen, setDeleteTodoModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useLocalStorage<View>('view-mode', 'table')
  const formRef = useRef<HTMLFormElement>(null)
  const dragItem = useRef('')
  const dragOverItem = useRef('')

  useEffect(() => {
    if (!todos) return

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

  const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
    dragItem.current = (e.target as HTMLTableRowElement).id
  }

  const dragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    dragOverItem.current = (e.target as HTMLDivElement).id
  }

  const drop = async () => {
    if (!user) return

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

  const openDeleteTodoModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, todo: Todo) => {
    e.stopPropagation()

    setDeleteTodoModalOpen(true)
    setSelectedTodoToDelete(todo)
  }

  return (
    <>
      <Heading
        title="All"
        action={
          <HeadingActions
            setError={setError}
            completedTodos={completedTodos}
            setView={setView}
            view={view}
          />
        }
      />
      {error && (
        <div className="flex items-center text-red-700">
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
      <div className="flex flex-col gap-4">
        <div className={clsx({ 'flex flex-wrap gap-4': view === 'card' })}>
          {localOrderedTodos.map((todo) => {
            return (
              <TodoListItem
                key={todo.todoId}
                todo={todo}
                dragStart={dragStart}
                dragEnter={dragEnter}
                drop={drop}
                openTodo={openTodo}
                openDeleteTodoModal={openDeleteTodoModal}
                view={view}
              />
            )
          })}
        </div>
        <Accordion label="Completed" itemLength={completedTodos.length}>
          {completedTodos.length === 0 ? (
            <div className="text-gray-600">There is no completed task.</div>
          ) : (
            <div className={clsx({ 'flex flex-wrap gap-4': view === 'card' })}>
              {completedTodos.map((todo) => {
                return (
                  <TodoListItem
                    key={todo.todoId}
                    todo={todo}
                    openTodo={openTodo}
                    openDeleteTodoModal={openDeleteTodoModal}
                    view={view}
                  />
                )
              })}
            </div>
          )}
        </Accordion>
      </div>
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
