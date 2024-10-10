'use client'

import { Button } from 'components/Button'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  // Router pushes /all if user is signed in, otherwise, redirects to /signin
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-8">
      <div className="text-9xl text-black">404</div>
      <p className="text-black">Oops, page not found!</p>
      <Button onClick={() => router.push('/all')} size="large" label="Return home" />
    </div>
  )
}
