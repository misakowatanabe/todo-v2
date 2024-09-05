'use client'

import { useState, useTransition } from 'react'
import { deleteAccount, deleteCookies } from 'app/actions'
import { Modal } from 'components/Modal'
import { Button } from 'components/Button'
import { auth } from 'app/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

type SubmitProps = { isPending: boolean; onDelete: React.MouseEventHandler<HTMLButtonElement> }

function Submit({ isPending, onDelete }: SubmitProps) {
  return (
    <Button
      type="submit"
      label={isPending ? 'Deleting...' : 'Delete'}
      disabled={isPending}
      onClick={onDelete}
    />
  )
}

export function DeleteAccount() {
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const onDelete = () => {
    startTransition(async () => {
      const res = await deleteAccount()

      if (!res.ok) {
        setError(res.error)
        return
      }

      try {
        await signOut(auth)
        await deleteCookies('user_logged_in')
        router.push('/signin')
      } catch (error) {
        setError(res.error)
        console.error('Error signing out: ', error instanceof Error ? error.message : String(error))
      }
    })
  }

  return (
    <>
      <Button
        type="button"
        label={isPending ? 'Deleting account...' : 'Delete account'}
        disabled={isPending}
        onClick={() => setDeleteAccountModalOpen(true)}
      />
      <Modal
        title="Delete account"
        setIsShowing={setDeleteAccountModalOpen}
        isShowing={deleteAccountModalOpen}
        okButton={<Submit isPending={isPending} onDelete={onDelete} />}
      >
        {error && (
          <div className="flex items-center text-red-700">
            <div>{error}</div>
            <Button
              type="button"
              style="text"
              size="small"
              label="OK"
              onClick={() => setError(null)}
            />
          </div>
        )}
        <div className="flex flex-col gap-6">
          <div>
            Are you sure you want to delete your account?
            <br />
            This will delete your account information and all todos data.
          </div>
        </div>
      </Modal>
    </>
  )
}
