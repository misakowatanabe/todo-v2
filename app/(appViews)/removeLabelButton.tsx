'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { Button } from 'components/Button'
import { Modal } from 'components/Modal'
import { useAppContext } from 'app/appContext'
import { removeLabel } from './removeLabel'
import { Alert } from 'components/Alert'
import { Icon } from 'components/icons'

type SubmitProps = { isPending: boolean; onRemove: React.MouseEventHandler<HTMLButtonElement> }

type RemoveLabelProps = { label: string }

function Submit({ isPending, onRemove }: SubmitProps) {
  return (
    <Button
      type="submit"
      label={isPending ? 'Deleting...' : 'Delete'}
      disabled={isPending}
      onClick={onRemove}
    />
  )
}

export function RemoveLabelButton({ label }: RemoveLabelProps) {
  const { user } = useAppContext()
  const [error, setError] = useState<string | null>(null)
  const [isShowing, setIsShowing] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!isShowing) {
      setError(null)
    }
  }, [isShowing])

  const onRemove = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setError(null)

    if (!user) return

    startTransition(async () => {
      const res = await removeLabel(user.uid, label)

      if (!res.ok) {
        setError(res.error)
      } else {
        setIsShowing(false)
      }
    })
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()

    setIsShowing(true)
  }

  const openButton = (
    <Button
      className="hidden group-hover:flex justify-center hover:bg-gray-200 rounded-full"
      icon={<Icon.Close />}
      size="small"
      style="text"
      onClick={(e) => handleClick(e)}
    />
  )

  return (
    <Modal
      title="Remove label"
      setIsShowing={setIsShowing}
      isShowing={isShowing}
      openButton={openButton}
      okButton={<Submit isPending={isPending} onRemove={onRemove} />}
    >
      <Alert severity="critical" message={error} onClose={() => setError(null)} className="mb-4" />
      <div>
        Remove the label <span className="font-semibold">&quot;{label}&quot;</span> from tasks and
        delete the label?
      </div>
    </Modal>
  )
}
