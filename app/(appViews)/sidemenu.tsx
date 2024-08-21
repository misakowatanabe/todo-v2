import Link from 'next/link'
import CreateTodo from './dashboard/createTodo'

export default function Sidemenu() {
  return (
    <div className="w-64 bg-red-200 flex flex-col gap-2 mx-6">
      <CreateTodo />
      <Link href="/dashboard">Todo</Link>
      <Link href="/account">Account</Link>
    </div>
  )
}
