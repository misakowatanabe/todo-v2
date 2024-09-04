import { Form } from './form'
import Link from 'next/link'

export default function Page() {
  return (
    <>
      <Form />
      <Link href="/signin">Signin</Link>
    </>
  )
}
