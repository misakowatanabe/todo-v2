import TodoList from './todoList'

export default function Page() {
  return (
    <>
      <div>
        <div className="my-6 text-4xl h-12 font-bold text-black">All</div>
        {/* add button group and others */}
      </div>
      <TodoList />
    </>
  )
}
