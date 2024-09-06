'use client'

import { useAppContext } from 'app/appContext'
import { Input } from 'components/Input'
import { Button } from 'components/Button'
import { useRef, useState, useTransition } from 'react'
import { Modal } from 'components/Modal'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updateProfile,
} from 'firebase/auth'

type SubmitProps = {
  isPending: boolean
}

function Submit({ isPending }: SubmitProps) {
  return (
    <Button
      type="submit"
      label={isPending ? 'Re-authenticating...' : 'Re-authenticate'}
      disabled={isPending}
      form="form-reauthenticate-user"
    />
  )
}

export function Profile() {
  const { user } = useAppContext()
  const [reauthenticationModalOpen, setReauthenticationModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newEmailInput, setNewEmailInput] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const onSubmitUpdateProfile = async (formData: FormData) => {
    setError(null)

    if (!user) return

    const newDisplayName = formData.get('displayName')
    const newEmail = formData.get('email')

    if (!newDisplayName || !newEmail) {
      setError('Both name and email need to filled to update')

      return
    }

    const currentDisplayName = user.displayName
    const currentEmail = user.email

    startTransition(async () => {
      try {
        if (currentDisplayName !== newDisplayName) {
          await updateProfile(user, { displayName: newDisplayName as string })
        }
        if (currentEmail !== newEmail) {
          await updateEmail(user, newEmail as string)
        }
        await user.reload()
      } catch (err) {
        // if the user signed in too long ago, the action fails, and the user needs to be re-authenticated by getting new sign-in credentials
        setNewEmailInput(newEmail as string)
        // TODO: disable closing modal unless password is filled
        setReauthenticationModalOpen(true)
      }
    })
  }

  const onReauthenticate = async (formData: FormData) => {
    const password = formData.get('password')

    if (!password || !user || !user.email || !newEmailInput) return

    const credential = EmailAuthProvider.credential(user.email, password as string)

    try {
      await reauthenticateWithCredential(user, credential)
      await user.reload()
      setReauthenticationModalOpen(false)

      if (!formRef.current) return

      formRef.current.reset()

      setError(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <div>
      <div className="text-2xl font-semibold text-black pb-3 border-b mb-4">Profile</div>
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
      <div className="flex flex-col gap-2">
        <form
          autoComplete="off"
          action={onSubmitUpdateProfile}
          className="flex gap-4"
          id="form-update-user-info"
          ref={formRef}
        >
          <Input
            defaultValue={user?.displayName ?? '******'}
            disabled={!user || isPending}
            label="Name"
            name="displayName"
            type="text"
            required={true}
          />
          <Input
            defaultValue={user?.email ?? '******'}
            disabled={!user || isPending}
            label="E-mail"
            name="email"
            type="email"
            required={true}
          />
        </form>
        <Button
          style="secondary"
          type="submit"
          label={isPending ? 'Saving...' : 'Update profile'}
          disabled={!user || isPending}
          form="form-update-user-info"
          className="w-fit"
        />
      </div>
      <Modal
        title="Re-authenticate"
        setIsShowing={setReauthenticationModalOpen}
        isShowing={reauthenticationModalOpen}
        okButton={<Submit isPending={isPending} />}
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
        <div>
          The session expired and failed to update your email. <br />
          Please re-authenticate yourself by typing your password, then, try updating email again!
        </div>
        <form
          autoComplete="off"
          action={onReauthenticate}
          className="flex gap-4"
          id="form-reauthenticate-user"
        >
          <Input
            disabled={!user || isPending}
            label="Password"
            name="password"
            type="password"
            required={true}
          />
        </form>
      </Modal>
    </div>
  )
}
