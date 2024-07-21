import Todo from './todo'
import CreateTodo from './createTodo'

export default function Page() {
  return (
    <>
      <div>Dashboard</div>
      <CreateTodo />
      <Todo />
    </>
  )
}
