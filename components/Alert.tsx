import React from 'react'
import clsx from 'clsx'
import { Icon } from 'components/icons'

type AccordionProps = {
  severity: 'info' | 'success' | 'warning' | 'critical'
  onClose?: React.MouseEventHandler<HTMLButtonElement>
  message: string | null
  className?: string
}

export function Alert({ severity, onClose, message, className }: AccordionProps) {
  return (
    <div
      className={clsx(
        'flex w-full items-center gap-4 rounded border px-4 py-3 text-base',
        { hidden: message == null },
        { 'border-blue-200 bg-blue-50 text-blue-500': severity === 'info' },
        { 'border-green-200 bg-green-50 text-green-500': severity === 'success' },
        { 'border-amber-200 bg-amber-50 text-amber-500': severity === 'warning' },
        { 'border-red-200 bg-red-50 text-red-500': severity === 'critical' },
        className,
      )}
      role="alert"
    >
      <p className="flex-1">{message}</p>
      {onClose && (
        <button
          aria-label="Close"
          className={clsx(
            'inline-flex h-8 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full px-4 text-xs font-medium tracking-wide transition duration-100 focus-visible:outline-none disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-transparent',
            {
              'text-blue-500 hover:bg-blue-100 hover:text-blue-600 focus:bg-blue-200 focus:text-blue-700 disabled:text-blue-300':
                severity === 'info',
            },
            {
              'text-green-500 hover:bg-green-100 hover:text-green-600 focus:bg-green-200 focus:text-green-700 disabled:text-green-300':
                severity === 'success',
            },
            {
              'text-amber-500 hover:bg-amber-100 hover:text-amber-600 focus:bg-amber-200 focus:text-amber-700 disabled:text-amber-300':
                severity === 'warning',
            },
            {
              'text-red-500 hover:bg-red-100 hover:text-red-600 focus:bg-red-200 focus:text-red-700 disabled:text-red-300':
                severity === 'critical',
            },
          )}
          onClick={onClose}
        >
          <Icon.Close size="small" className="flex justify-center -mx-4" />
        </button>
      )}
    </div>
  )
}
