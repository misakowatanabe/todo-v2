import React, { forwardRef } from 'react'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { ...props }: TextareaProps,
  ref,
) {
  return (
    <textarea
      ref={ref}
      className="relative w-full rounded border border-transparent focus:px-4 invalid:px-4 py-2 text-base text-black outline-none transition-all autofill:bg-white invalid:border-red-500 invalid:text-red-500 focus:border-gray-600 focus:outline-none invalid:focus:border-red-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
      {...props}
    />
  )
})
