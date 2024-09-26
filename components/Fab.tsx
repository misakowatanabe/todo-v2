import React, { forwardRef } from 'react'
import clsx from 'clsx'

type FabProps = {
  icon: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  onClick?: (_event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  className?: string
  testid?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const Fab = forwardRef<HTMLButtonElement, FabProps>(function Fab(
  { icon, size = 'medium', onClick, disabled, className, testid }: FabProps,
  ref,
) {
  return (
    <div className={clsx('fixed bottom-8 right-8 z-10', className)}>
      <button
        className={clsx(
          'relative z-50 inline-flex items-center justify-center self-center rounded-full transition duration-100 focus-visible:outline-gray-500',
          {
            'w-8 h-8': size === 'small',
            'w-10 h-10': size === 'medium',
            'w-12 h-12': size === 'large',
          },
          disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-gray-200 hover:bg-gray-300',
        )}
        onClick={!disabled ? onClick : undefined}
        ref={ref}
        data-testid={testid}
      >
        <div
          className={clsx(
            'inline-flex text-sm font-medium tracking-wide transition duration-100',
            'focus-visible:outline-none pointer-events-none',
            {
              'h-4 w-4': size === 'small',
              'h-[18px] w-[18px]': size === 'medium',
              'h-5 w-5': size === 'large',
            },
            disabled ? 'cursor-not-allowed text-gray-400' : 'text-black',
          )}
          aria-label="icon"
        >
          {icon}
        </div>
      </button>
    </div>
  )
})
