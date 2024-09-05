'use client'

import { useAppContext } from 'app/appContext'
import { Input } from 'components/Input'
import { Button } from 'components/Button'
import { useRef, useState, useTransition } from 'react'
import { User, updateProfile } from 'app/actions'

export function Profile() {
  const { user } = useAppContext()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const onSubmitUpdateProfile = async (formData: FormData) => {
    setError(null)

    const newDisplayName = formData.get('displayName')
    const newEmail = formData.get('email')

    if (!newDisplayName || !newEmail) {
      setError('Both name and email need to filled to update')

      return
    }

    const currentDisplayName = user?.displayName
    const currentEmail = user?.email

    const profileObject: User = {}

    if (currentDisplayName !== newDisplayName) {
      profileObject['displayName'] = newDisplayName as string
    }

    if (currentEmail !== newEmail) {
      profileObject['email'] = newEmail as string
    }

    if (Object.keys(profileObject).length === 0) {
      setError('No change')

      return
    }

    startTransition(async () => {
      const res = await updateProfile(profileObject)

      if (!res.ok) {
        setError(res.error)

        return
      }

      // TODO: investigate why user gets lost after email update and manual reload, or after user.reload()
      if (!formRef.current) return

      formRef.current.reset()

      if (!user) return

      await user.reload()
    })
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
    </div>
  )
}
