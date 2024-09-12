import React, { forwardRef } from 'react'
import clsx from 'clsx'

type TextareaProps = {
  size?: 'small' | 'medium' | 'large'
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { size = 'medium', ...props }: TextareaProps,
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={clsx(
        'relative w-full rounded border border-transparent resize-none py-2 text-black outline-none transition-all autofill:bg-white focus-visible:outline-none',
        'focus:px-4 focus:border-gray-600 focus:outline-none',
        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400',
        'invalid:px-4 invalid:border-red-500 invalid:text-red-500 invalid:focus:border-red-500',
        { 'text-sm': size === 'small' },
        { 'text-base': size === 'medium' },
        { 'text-xl': size === 'large' },
      )}
      {...props}
    />
  )
})
