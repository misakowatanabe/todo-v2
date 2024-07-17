import Link from 'next/link'

export default function Sidemenu() {
  return (
    <div className="w-64 bg-red-200 flex flex-col">
      <Link href="/dashboard">Todo</Link>
      <Link href="/account">Account</Link>
    </div>
  )
}
