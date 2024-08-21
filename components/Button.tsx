import React, { ReactNode, forwardRef } from 'react'
import clsx from 'clsx'

type ButtonProps = {
  style?: 'primary' | 'secondary' | 'text'
  size?: 'small' | 'medium' | 'large'
  backgroundColor?: string
  label: string
  icon?: ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: (_event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  form?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    style = 'primary',
    size = 'medium',
    backgroundColor,
    label,
    icon,
    type = 'button',
    onClick,
    disabled,
    form,
    ...props
  }: ButtonProps,
  ref,
) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium rounded-full cursor-pointer leading-none',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500',
        !disabled && {
          'text-white bg-black': style === 'primary',
          'text-black outline outline-offset-0 outline-black bg-transparent': style === 'secondary',
          'text-black': style === 'text',
        },
        disabled && {
          'text-white bg-[#b3b3b3]': style === 'primary',
          'text-[#b3b3b3] outline outline-offset-0 outline-[#c8c8c8] bg-transparent':
            style === 'secondary',
          'text-[#b3b3b3]': style === 'text',
        },
        {
          'text-xs px-4 h-8': size === 'small',
          'text-sm px-5 h-10': size === 'medium',
          'text-base px-6 h-12': size === 'large',
        },
      )}
      onClick={!disabled ? onClick : undefined}
      form={form}
      ref={ref}
      {...props}
    >
      {icon && (
        <div
          className={clsx(
            'inline-flex h-5 w-5 items-center justify-center whitespace-nowrap rounded-full text-sm font-medium tracking-wide transition duration-100',
            'focus-visible:outline-none disabled:cursor-not-allowed cursor-pointer',
          )}
          aria-label="icon"
        >
          <span className="relative only:-mx-5">{icon}</span>
        </div>
      )}
      {label}
      <style jsx>{`
        button {
          background-color: ${backgroundColor};
        }
      `}</style>
    </button>
  )
})
