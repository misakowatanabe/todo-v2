import Link from 'next/link'
import CreateTodo from './createTodo'
import LabelList from './labelList'

export default function Sidemenu() {
  return (
    <div className="w-64 flex flex-col gap-2 mx-6">
      <CreateTodo />
      <Link href="/dashboard">Todo</Link>
      <LabelList />
      -----------------------
      <Link href="/account">Account</Link>
    </div>
  )
}
