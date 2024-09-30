import React, { forwardRef } from 'react'

type InputProps = {
  label?: string
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void
  testid?: string
  validationMessage?: string
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
    testid,
    validationMessage,
    required,
    pattern,
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
        className="peer h-10 w-full rounded border border-gray-200 px-4 text-base text-black placeholder-transparent outline-none transition-all autofill:bg-white focus:border-black focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 focus:text-black invalid:text-red-500 invalid:border-red-500"
        onChange={onChange}
        disabled={disabled}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        data-testid={testid}
        required={required}
        pattern={pattern}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-2 -top-2 z-[1] cursor-text px-2 text-xs text-gray-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2 peer-required:after:content-['\00a0*'] peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-black peer-disabled:cursor-not-allowed peer-disabled:text-gray-400 peer-disabled:before:bg-transparent peer-invalid:text-red-500"
      >
        {label}
      </label>
      {validationMessage && (
        <span className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
          {validationMessage}
        </span>
      )}
    </div>
  )
})
