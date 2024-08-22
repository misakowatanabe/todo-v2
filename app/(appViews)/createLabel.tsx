'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { Button } from 'components/Button'
import { Chip, ChipColor, colorOptions } from 'components/Chip'
import Modal from 'components/Modal'
import { Label, createLabel } from 'app/actions'
import clsx from 'clsx'

type SubmitProps = { isPending: boolean }

function Submit({ isPending }: SubmitProps) {
  return (
    <Button
      type="submit"
      label={isPending ? 'Creating...' : 'Create'}
      disabled={isPending}
      form="form-new-label"
    />
  )
}

export default function CreateLabel() {
  const [color, setColor] = useState<ChipColor | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isShowing, setIsShowing] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!isShowing) {
      setColor(null)
      setError(null)
    }
  }, [isShowing])

  const onSubmitTodo = async (formData: FormData) => {
    setError(null)

    if (!color || !formData.get('label')) {
      setError('Please select both label name and color.')

      return
    }

    // TODO: add validation for name input
    const label: Label = {
      label: formData.get('label') as string,
      color: color,
    }

    startTransition(async () => {
      const res = await createLabel(label)
      if (!res.ok) {
        setError(res.error)
      } else {
        setIsShowing(false)
        setColor(null)
      }
    })
  }

  const plusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-labelledby="title-ac01 desc-ac01"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )

  const openButton = (
    <Button
      onClick={() => setIsShowing(true)}
      label="New label"
      icon={plusIcon}
      style="text"
      size="medium"
    />
  )

  return (
    <Modal
      title="New label"
      setIsShowing={setIsShowing}
      isShowing={isShowing}
      openButton={openButton}
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
      <div className="flex flex-col gap-6">
        <form
          autoComplete="off"
          action={onSubmitTodo}
          className="flex flex-col gap-2"
          id="form-new-label"
        >
          <input name="label" type="text" placeholder="Label name" disabled={isPending} />
        </form>
        <div className="flex gap-1 flex-wrap">
          {colorOptions.map((el, idx) => (
            <div
              className={clsx({
                'outline outline-2 outline-offset-2 outline-gray-900 rounded': el === color,
              })}
              key={idx}
            >
              <Chip label="Aa" color={el} onClick={() => setColor(el)} />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
