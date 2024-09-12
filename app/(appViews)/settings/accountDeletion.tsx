'use client'

import { useAppContext } from 'app/appContext'
import { useState, useTransition } from 'react'
import { deleteCookies } from 'app/actions'
import { Modal } from 'components/Modal'
import { Button } from 'components/Button'
import { Alert } from 'components/Alert'
import { auth } from 'app/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { deleteAccount } from './deleteAccount'

type SubmitProps = { isPending: boolean; onDelete: React.MouseEventHandler<HTMLButtonElement> }

function Submit({ isPending, onDelete }: SubmitProps) {
  return (
    <Button
      style="critical"
      type="submit"
      label={isPending ? 'Deleting...' : 'Delete'}
      disabled={isPending}
      onClick={onDelete}
    />
  )
}

export function AccountDeletion() {
  const { user } = useAppContext()
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const onDelete = () => {
    if (!user) return

    startTransition(async () => {
      const res = await deleteAccount(user)

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
    <div>
      <div className="text-2xl font-semibold text-red-600 pb-3 border-b mt-10 mb-4">
        Delete Account
      </div>
      <div className="flex flex-col gap-4">
        <div>Once you delete your account, there is no going back.</div>
        <Button
          style="critical"
          type="button"
          label={isPending ? 'Deleting account...' : 'Delete account'}
          disabled={!user || isPending}
          onClick={() => setDeleteAccountModalOpen(true)}
          className="w-fit"
        />
      </div>
      <Modal
        title="Delete account"
        setIsShowing={setDeleteAccountModalOpen}
        isShowing={deleteAccountModalOpen}
        okButton={<Submit isPending={isPending} onDelete={onDelete} />}
      >
        <div className="flex flex-col gap-4">
          <Alert severity="critical" message={error} onClose={() => setError(null)} />
          <div>
            Are you sure you want to delete your account?
            <br />
            This will delete your account information and all todos data.
          </div>
        </div>
      </Modal>
    </div>
  )
}
