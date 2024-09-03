'use client'

import { useAppContext } from 'app/appContext'
import { useEffect, useRef, useState, useTransition } from 'react'
import { Todo, deleteCompletedTodos, updateOrder } from 'app/actions'
import TodoDetail from '../todoDetail'
import DeleteTodoModal from '../DeleteTodoModal'
import { TodoListItem, View } from '../todoListItem'
import { Heading } from 'components/Heading'
import { Accordion } from 'components/Accordion'
import { Button } from 'components/Button'
import { DropdownMenu, MenuItem } from 'components/DropdownMenu'
import { ButtonSwitcher } from 'components/ButtonSwitcher'

type HeadingActionsProps = {
  setError: React.Dispatch<React.SetStateAction<string | null>>
  completedTodos: Todo[]
  setView: React.Dispatch<React.SetStateAction<View>>
}

function HeadingActions({ setError, completedTodos, setView }: HeadingActionsProps) {
  const [isPending, startTransition] = useTransition()

  const verticalDotsIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1"></circle>
      <circle cx="12" cy="5" r="1"></circle>
      <circle cx="12" cy="19" r="1"></circle>
    </svg>
  )

  const listIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  )

  const gridIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  )

  const handleDeleteCompleted = () => {
    setError(null)

    startTransition(async () => {
      const res = await deleteCompletedTodos()

      if (!res.ok) {
        setError(res.error)
      }
    })
  }

  const menuItems: MenuItem[] = [
    {
      label: 'Delete completed todos',
      onClick: handleDeleteCompleted,
      disabled: isPending || completedTodos.length === 0,
    },
  ]

  const handleSwitch = (e: any) => {
    // the right one is selected when checked
    setView(e.target.checked ? 'card' : 'table')
  }

  return (
    <div className="flex gap-2.5">
      <DropdownMenu icon={verticalDotsIcon} items={menuItems} alignment="right" />
      <ButtonSwitcher
        onChange={handleSwitch}
        left={{ icon: listIcon }}
        right={{ icon: gridIcon }}
      />
    </div>
  )
}

export default function TodoList() {
  const { todos, completedTodos, socketError } = useAppContext()
  const [localOrderedTodos, setLocalOrderedTodos] = useState<Todo[]>([])
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [labels, setLabels] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTodoToDelete, setSelectedTodoToDelete] = useState<Todo | null>(null)
  const [deleteTodoModalOpen, setDeleteTodoModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<View>('table')
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
    await updateOrder(order)

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
        itemLength={todos.length}
        action={
          <HeadingActions setError={setError} completedTodos={completedTodos} setView={setView} />
        }
      />
      <div className="text-red-700">{socketError}</div>
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
        <div>
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
            <>
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
            </>
          )}
        </Accordion>
      </div>
      <TodoDetail
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedTodo={selectedTodo}
        labels={labels}
        setLabels={setLabels}
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
