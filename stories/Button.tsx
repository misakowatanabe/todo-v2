import React from 'react'
import clsx from 'clsx'

interface ButtonProps {
  style?: 'primary' | 'secondary' | 'text'
  backgroundColor?: string
  size?: 'small' | 'medium' | 'large'
  label: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export const Button = ({
  style = 'primary',
  size = 'medium',
  backgroundColor,
  label,
  type = 'button',
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(
        'font-sans font-bold rounded-full cursor-pointer inline-block leading-none',
        {
          'text-white bg-[#1ea7fd]': style === 'primary',
          'text-[#333333] bg-transparent shadow-[0_0_0_1px_rgba(0,0,0,0.15)]':
            style === 'secondary',
        },
        {
          'text-xs py-2.5 px-4': size === 'small',
          'text-sm py-3 px-5': size === 'medium',
          'text-base py-3 px-6': size === 'large',
        },
      )}
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
