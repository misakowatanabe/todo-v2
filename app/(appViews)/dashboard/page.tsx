import TodoList from './todoList'
import CreateTodo from './createTodo'

export default function Page() {
  return (
    <>
      <div>Dashboard</div>
      <CreateTodo />
      <TodoList />
    </>
  )
}
