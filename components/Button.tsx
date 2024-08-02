import React from 'react'
import clsx from 'clsx'

interface ButtonProps {
  style?: 'primary' | 'secondary' | 'text'
  size?: 'small' | 'medium' | 'large'
  backgroundColor?: string
  label: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: (_event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  form?: string
}

export const Button = ({
  style = 'primary',
  size = 'medium',
  backgroundColor,
  label,
  type = 'button',
  onClick,
  disabled,
  form,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(
        'font-sans font-bold rounded-full cursor-pointer inline-block leading-none',
        !disabled && {
          'text-white bg-[#1ea7fd]': style === 'primary',
          'text-[#333333] bg-transparent shadow-[0_0_0_1px_rgba(0,0,0,0.15)]':
            style === 'secondary',
          'text-[#1ea7fd]': style === 'text',
        },
        disabled && {
          'text-white bg-[#727679]': style === 'primary',
          'text-[#7e7e7e] bg-transparent shadow-[0_0_0_1px_rgba(0,0,0,0.15)]':
            style === 'secondary',
          'text-[#727679]': style === 'text',
        },
        {
          'text-xs py-2.5 px-4': size === 'small',
          'text-sm py-3 px-5': size === 'medium',
          'text-base py-3 px-6': size === 'large',
        },
      )}
      onClick={!disabled ? onClick : undefined}
      form={form}
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
}
