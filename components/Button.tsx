import React, { ReactNode, forwardRef } from 'react'
import clsx from 'clsx'

type ButtonProps = {
  style?: 'primary' | 'secondary' | 'text' | 'critical'
  size?: 'small' | 'medium' | 'large'
  backgroundColor?: string
  label?: string
  icon?: ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: (_event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  form?: string
  hover?: boolean
  className?: string
  testid?: string
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
    hover = true,
    className,
    testid,
    ...props
  }: ButtonProps,
  ref,
) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium rounded-full cursor-pointer leading-none transition duration-100',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500',
        !disabled && {
          'text-white bg-black': style === 'primary',
          'text-black outline outline-offset-0 outline-black bg-transparent': style === 'secondary',
          'text-black': style === 'text',
          'text-red-700 outline outline-offset-0 outline-red-700 bg-red-50': style === 'critical',
          'hover:bg-gray-600': style === 'primary' && hover,
          'hover:bg-gray-100': style === 'secondary' && hover,
          'hover:bg-gray-200': style === 'text' && hover,
          'hover:bg-red-300': style === 'critical' && hover,
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
        !label && {
          'w-8': size === 'small',
          'w-10': size === 'medium',
          'w-12': size === 'large',
        },
        className,
      )}
      onClick={!disabled ? onClick : undefined}
      form={form}
      ref={ref}
      data-testid={testid}
      {...props}
    >
      {icon && (
        <div
          className={clsx(
            'relative inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium tracking-wide transition duration-100',
            'focus-visible:outline-none disabled:cursor-not-allowed cursor-pointer pointer-events-none',
            {
              'h-4 w-4': size === 'small',
              'h-[18px] w-[18px]': size === 'medium',
              'h-5 w-5': size === 'large',
            },
            !label && {
              '-mx-4': size === 'small',
              '-mx-[18px]': size === 'medium',
              '-mx-5': size === 'large',
            },
          )}
          aria-label="icon"
        >
          {icon}
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
