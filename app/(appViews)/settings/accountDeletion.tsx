'use client'

import { useAppContext } from 'app/appContext'
import { useRef, useState, useTransition } from 'react'
import { deleteCookies } from 'app/actions'
import { Modal } from 'components/Modal'
import { Button } from 'components/Button'
import { Alert } from 'components/Alert'
import { auth } from 'app/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { deleteTodos } from './deleteTodos'
import { EmailAuthProvider, deleteUser, reauthenticateWithCredential } from 'firebase/auth'
import { Input } from 'components/Input'

type SubmitProps = {
  isPending: boolean
  onDelete: React.MouseEventHandler<HTMLButtonElement>
  reauthenticationInputOpen: boolean
}

function Submit({ isPending, onDelete, reauthenticationInputOpen }: SubmitProps) {
  return (
    <Button
      style="critical"
      type="submit"
      label={isPending ? 'Deleting...' : 'Delete'}
      disabled={isPending || reauthenticationInputOpen}
      onClick={onDelete}
    />
  )
}

export function AccountDeletion() {
  const { user } = useAppContext()
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false)
  const [reauthenticationInputOpen, setReauthenticationInputOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const onDelete = () => {
    if (!user) return

    startTransition(async () => {
      const res = await deleteTodos(user)

      if (!res.ok) {
        setError(res.error)

        // do not delete user account unless todos data has been deleted.
        return
      }

      // delete user account
      try {
        await deleteUser(user)
      } catch (err) {
        // if the user signed in too long ago, the action fails, and the user needs to be re-authenticated by providing new sign-in credentials
        setReauthenticationInputOpen(true)

        return
      }

      try {
        await signOut(auth)
        await deleteCookies('user_logged_in')
        router.push('/signin')
      } catch (error) {
        setError('Error signing out')
      }
    })
  }

  const onReauthenticate = async (formData: FormData) => {
    if (!user || !user.email) {
      setError('Something went wrong! Please sign out and sign in again.')

      return
    }

    const password = formData.get('password')

    if (!password) {
      setError('Please enter your password!')

      return
    }

    const credential = EmailAuthProvider.credential(user.email, password as string)

    try {
      await reauthenticateWithCredential(user, credential)

      setReauthenticationInputOpen(false)

      if (!formRef.current) return

      formRef.current.reset()
      setError(null)
    } catch (error) {
      setError('The password you entered seems wrong!')
    }
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
        okButton={
          <Submit
            isPending={isPending}
            onDelete={onDelete}
            reauthenticationInputOpen={reauthenticationInputOpen}
          />
        }
      >
        <div className="flex flex-col gap-4">
          <Alert severity="critical" message={error} onClose={() => setError(null)} />
          <div>
            Are you sure you want to delete your account?
            <br />
            This will delete your account information and all todos data.
          </div>
        </div>
        {reauthenticationInputOpen && (
          <div className="my-8">
            <div className="text-red-700">
              The session has expired and failed to delete your account. <br />
              Please re-authenticate yourself by typing your password, then, try again!
            </div>
            <form
              autoComplete="off"
              action={onReauthenticate}
              className="flex gap-4"
              id="form-reauthenticate-user"
              ref={formRef}
            >
              <Input
                disabled={!user || isPending}
                label="Password"
                name="password"
                type="password"
                required={true}
                autoComplete="off"
              />
            </form>
            <Button
              type="submit"
              label={isPending ? 'Re-authenticating...' : 'Re-authenticate'}
              disabled={isPending}
              form="form-reauthenticate-user"
            />
          </div>
        )}
      </Modal>
    </div>
  )
}
