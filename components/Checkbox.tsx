import React, { forwardRef } from 'react'
import clsx from 'clsx'
import { Icon } from './icons'

type CheckboxProps = {
  label?: string
  disabled?: boolean
  checked: boolean
  onChange: (_event: React.ChangeEvent<HTMLInputElement>) => void
  id: string
  className?: string
  testid?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, disabled = false, checked, onChange, id, className, testid }: CheckboxProps,
  ref,
) {
  return (
    <div className={clsx('relative flex items-center h-fit', className)}>
      <input
        ref={ref}
        className={clsx(
          'peer w-10 h-10 items-center cursor-pointer appearance-none flex justify-center hover:bg-gray-600/10 rounded-full transition-all duration-100',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        id={id}
        data-testid={testid}
      />
      <div
        className={clsx(
          'pointer-events-none absolute left-3 h-4 w-4 rounded border-2 transition-colors focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500',
          !disabled && {
            'border-black bg-black': checked,
            'border-black bg-transparent': !checked,
          },
          disabled && {
            'cursor-not-allowed border-gray-400 bg-gray-400': checked,
            'cursor-not-allowed border-gray-400 bg-gray-200': !checked,
          },
        )}
      />
      {label && (
        <label
          className="cursor-pointer pl-2 text-gray-500 peer-disabled:cursor-not-allowed peer-disabled:text-gray-400"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <Icon.Check
        size="small"
        viewBox="0 0 16 16"
        aria-hidden="true"
        strokeWidth={1}
        className="pointer-events-none absolute left-3 top-3 -rotate-90 fill-white stroke-white opacity-0 transition-all duration-100 peer-checked:rotate-0 peer-checked:opacity-100 peer-disabled:cursor-not-allowed"
      />
    </div>
  )
})
