import React, { ReactNode, forwardRef } from 'react'
import clsx from 'clsx'

type ButtonOption = { label?: string; icon?: ReactNode }

type ButtonSwitcherProps = {
  size?: 'small' | 'medium' | 'large'
  left: ButtonOption
  right: ButtonOption
  onChange: (_event: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  checked?: boolean
} & React.ButtonHTMLAttributes<HTMLLabelElement>

export const ButtonSwitcher = forwardRef<HTMLInputElement, ButtonSwitcherProps>(
  function ButtonSwitcher(
    { size = 'medium', left, right, onChange, disabled = false, checked }: ButtonSwitcherProps,
    ref,
  ) {
    return (
      <div className="group relative inline-flex items-center rounded-full bg-gray-100">
        <input
          className="peer order-2 hidden"
          type="checkbox"
          id="button-switcher"
          ref={ref}
          onChange={onChange}
          checked={checked}
        />
        <label
          className={clsx(
            'order-1 inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-colors',
            'bg-white text-black outline outline-offset-0 outline-black',
            'peer-checked:bg-transparent peer-checked:text-gray-500 peer-checked:outline-transparent',
            {
              'text-xs h-8 px-4': size === 'small',
              'text-sm h-10 px-5': size === 'medium',
              'text-base h-12 px-6': size === 'large',
            },
            !right.label && {
              'w-8': size === 'small',
              'w-10': size === 'medium',
              'w-12': size === 'large',
            },
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
          htmlFor="button-switcher"
        >
          <div
            className={clsx(
              'inline-flex items-center justify-center',
              {
                'h-4 w-4': size === 'small',
                'h-[18px] w-[18px]': size === 'medium',
                'h-5 w-5': size === 'large',
              },
              !left.label && {
                '-mx-4': size === 'small',
                '-mx-[18px]': size === 'medium',
                '-mx-5': size === 'large',
              },
            )}
          >
            {left.icon}
          </div>
          {left.label}
        </label>
        <label
          className={clsx(
            'order-1 inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-colors',
            'bg-transparent text-gray-500',
            'peer-checked:bg-white peer-checked:text-black peer-checked:outline peer-checked:outline-offset-0 peer-checked:outline-black',
            {
              'text-xs h-8 px-4': size === 'small',
              'text-sm h-10 px-5': size === 'medium',
              'text-base h-12 px-6': size === 'large',
            },
            !right.label && {
              'w-8': size === 'small',
              'w-10': size === 'medium',
              'w-12': size === 'large',
            },
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
          htmlFor="button-switcher"
        >
          <div
            className={clsx(
              'inline-flex items-center justify-center',
              {
                'h-4 w-4': size === 'small',
                'h-[18px] w-[18px]': size === 'medium',
                'h-5 w-5': size === 'large',
              },
              !right.label && {
                '-mx-4': size === 'small',
                '-mx-[18px]': size === 'medium',
                '-mx-5': size === 'large',
              },
            )}
          >
            {right.icon}
          </div>
          {right.label}
        </label>
      </div>
    )
  },
)
