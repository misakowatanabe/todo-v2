import Link from 'next/link'
import CreateTodo from './createTodo'
import CreateLabel from './createLabel'

export default function Sidemenu() {
  return (
    <div className="w-64 flex flex-col gap-2 mx-6">
      <CreateTodo />
      <Link href="/dashboard">Todo</Link>
      <Link href="/account">Account</Link>
      <CreateLabel />
    </div>
  )
}
