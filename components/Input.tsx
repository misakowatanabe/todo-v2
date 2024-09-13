import React, { forwardRef } from 'react'

type InputProps = {
  label?: string
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void
} & React.InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    value,
    onChange,
    placeholder,
    id,
    type,
    disabled,
    name,
    defaultValue,
    autoComplete,
  }: InputProps,
  ref,
) {
  return (
    <div className="relative inline-block w-full my-3">
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        // TODO: make placeholder optional with static label
        placeholder={placeholder ?? label}
        value={value}
        className="peer h-10 w-full rounded border border-gray-200 px-4 text-base text-black placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-red-500 invalid:text-red-500 focus:border-black focus:outline-none invalid:focus:border-red-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
        onChange={onChange}
        disabled={disabled}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-2 -top-2 z-[1] cursor-text px-2 text-xs text-gray-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2 peer-required:after:text-red-500 peer-required:after:content-['\00a0*'] peer-invalid:text-red-500 peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-black peer-invalid:peer-focus:text-red-500 peer-disabled:cursor-not-allowed peer-disabled:text-gray-400 peer-disabled:before:bg-transparent"
      >
        {label}
      </label>
    </div>
  )
})
