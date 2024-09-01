'use client'

import { useAppContext } from 'app/appContext'
import { useEffect, useRef, useState } from 'react'
import { Todo, updateOrder } from 'app/actions'
import TodoDetail from '../todoDetail'
import DeleteTodoModal from '../DeleteTodoModal'
import { TodoListItem } from '../todoListItem'
import { Heading } from 'components/Heading'
import { Accordion } from 'components/Accordion'

export default function TodoList() {
  const { todos, completedTodos, socketError } = useAppContext()
  const [localOrderedTodos, setLocalOrderedTodos] = useState<Todo[]>([])
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [labels, setLabels] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTodoToDelete, setSelectedTodoToDelete] = useState<Todo | null>(null)
  const [deleteTodoModalOpen, setDeleteTodoModalOpen] = useState(false)
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
      <Heading title="All" itemLength={todos.length} />
      <div className="text-red-700">{socketError}</div>
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
