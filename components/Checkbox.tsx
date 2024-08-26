import React, { forwardRef } from 'react'
import clsx from 'clsx'

type CheckboxProps = {
  label?: string
  disabled?: boolean
  checked: boolean
  onchange: (_event: React.ChangeEvent<HTMLInputElement>) => void
  id: string
} & React.InputHTMLAttributes<HTMLInputElement>

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, disabled = false, checked, onchange, id }: CheckboxProps,
  ref,
) {
  return (
    <div className="relative flex flex-wrap items-center">
      <input
        ref={ref}
        className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-black bg-white transition-colors checked:border-black checked:bg-black focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-gray-200 disabled:checked:bg-gray-400"
        type="checkbox"
        checked={checked}
        onChange={onchange}
        disabled={disabled}
        id={id}
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
          'pointer-events-none absolute left-0 h-4 w-4 -rotate-90 fill-white stroke-white opacity-0 transition-all duration-100 peer-checked:rotate-0 peer-checked:opacity-100 peer-disabled:cursor-not-allowed',
          { 'top-1': label },
          { 'top-0': !label },
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
