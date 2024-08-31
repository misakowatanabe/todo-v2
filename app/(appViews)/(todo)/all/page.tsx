import TodoList from './todoList'
import { Heading } from '../../Heading'

export default function Page() {
  return (
    <>
      <div>
        {/* add button group and others as action */}
        <Heading title="All" />
      </div>
      <TodoList />
    </>
  )
}
