import React, { forwardRef } from 'react'
import clsx from 'clsx'

type CheckboxProps = {
  label?: string
  disabled?: boolean
  checked: boolean
  onChange: (_event: React.ChangeEvent<HTMLInputElement>) => void
  id: string
} & React.InputHTMLAttributes<HTMLInputElement>

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, disabled = false, checked, onChange, id }: CheckboxProps,
  ref,
) {
  return (
    <div className="relative flex items-center">
      <input
        ref={ref}
        className={clsx(
          'peer w-10 h-10 items-center cursor-pointer appearance-none flex justify-center hover:bg-gray-200 rounded-full transition-all duration-100',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        id={id}
      />
      <div
        className={clsx(
          'pointer-events-none absolute left-3 h-4 w-4 rounded border-2 transition-colors focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500',
          !disabled && {
            'border-black bg-black': checked,
            'border-black bg-transparent': !checked,
          },
          disabled && {
            'cursor-not-allowed border-gray-400 bg-gray-400': checked,
            'cursor-not-allowed border-gray-400 bg-gray-200': !checked,
          },
        )}
      />
      {label && (
        <label
          className="cursor-pointer pl-2 text-gray-500 peer-disabled:cursor-not-allowed peer-disabled:text-gray-400"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <svg
        className={clsx(
          'pointer-events-none absolute left-3 top-3 h-4 w-4 -rotate-90 fill-white stroke-white opacity-0 transition-all duration-100 peer-checked:rotate-0 peer-checked:opacity-100 peer-disabled:cursor-not-allowed',
        )}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        aria-labelledby="title-1 description-1"
        role="graphics-symbol"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.8116 5.17568C12.9322 5.2882 13 5.44079 13 5.5999C13 5.759 12.9322 5.91159 12.8116 6.02412L7.66416 10.8243C7.5435 10.9368 7.37987 11 7.20925 11C7.03864 11 6.87501 10.9368 6.75435 10.8243L4.18062 8.42422C4.06341 8.31105 3.99856 8.15948 4.00002 8.00216C4.00149 7.84483 4.06916 7.69434 4.18846 7.58309C4.30775 7.47184 4.46913 7.40874 4.63784 7.40737C4.80655 7.406 4.96908 7.46648 5.09043 7.57578L7.20925 9.55167L11.9018 5.17568C12.0225 5.06319 12.1861 5 12.3567 5C12.5273 5 12.691 5.06319 12.8116 5.17568Z"
        />
      </svg>
    </div>
  )
})
