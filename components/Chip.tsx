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

export const Chip = ({
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
        {
          'text-white bg-[#222222]': style === 'primary',
          'text-[#222222] outline outline-offset-0 outline-[#222222] bg-transparent':
            style === 'secondary',
          'text-[#222222]': style === 'text',
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
