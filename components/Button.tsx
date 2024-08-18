import React, { forwardRef } from 'react'
import clsx from 'clsx'

type ButtonProps = {
  style?: 'primary' | 'secondary' | 'text'
  size?: 'small' | 'medium' | 'large'
  backgroundColor?: string
  label: string
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
        'font-sans font-bold rounded-full cursor-pointer inline-block leading-none',
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
          'text-xs py-2.5 px-4': size === 'small',
          'text-sm py-3 px-5': size === 'medium',
          'text-base py-3 px-6': size === 'large',
        },
      )}
      onClick={!disabled ? onClick : undefined}
      form={form}
      ref={ref}
      {...props}
    >
      {label}
      <style jsx>{`
        button {
          background-color: ${backgroundColor};
        }
      `}</style>
    </button>
  )
})
