import { TodoListItem } from './todoListItem'
import { Accordion } from 'components/Accordion'
import { Spinner } from 'components/Spinner'
import { Alert } from 'components/Alert'
import clsx from 'clsx'
import { View } from 'utils/useLocalStorage'
import { Todo } from 'app/actions'

type TodosWrapperProps = { children: React.ReactNode; view: View }

type Error = string | null

type TodoListLayoutProps = {
  setError: React.Dispatch<React.SetStateAction<Error>>
  error: Error
  todos: Todo[] | null
  completedTodos: Todo[] | null
  view: View
  openTodo: (_todo: Todo) => void
  openDeleteTodoModal: (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>, _todo: Todo) => void
} & (
  | {
      dragStart: (_e: React.DragEvent<HTMLButtonElement>) => void
      dragEnter: (_e: React.DragEvent<HTMLDivElement>) => void
      drop: () => Promise<void>
    }
  | {
      dragStart?: never
      dragEnter?: never
      drop?: never
    }
)

function TodosWrapper({ children, view }: TodosWrapperProps) {
  return (
    <div
      className={clsx({
        'grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4': view === 'card',
      })}
    >
      {children}
    </div>
  )
}

export function TodoListLayout({
  setError,
  error,
  todos,
  completedTodos,
  view,
  dragStart,
  dragEnter,
  drop,
  openTodo,
  openDeleteTodoModal,
}: TodoListLayoutProps) {
  if (todos == null || completedTodos == null)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    )

  const Todos = () => {
    if (todos.length === 0) return <div className="text-gray-600">No active tasks.</div>

    return (
      <TodosWrapper view={view}>
        {todos.map((todo) => {
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
      </TodosWrapper>
    )
  }

  const CompletedTodos = () => {
    if (completedTodos.length === 0) return <div className="text-gray-600">No completed tasks.</div>

    return (
      <TodosWrapper view={view}>
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
      </TodosWrapper>
    )
  }

  return (
    <>
      <Alert severity="critical" message={error} onClose={() => setError(null)} className="mb-4" />
      <div className="flex flex-col gap-4">
        <Todos />
        <Accordion label="Completed" itemLength={completedTodos.length} testid="open-completed">
          <CompletedTodos />
        </Accordion>
      </div>
    </>
  )
}
