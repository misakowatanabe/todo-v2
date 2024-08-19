import React, { ReactNode, forwardRef } from 'react'
import clsx from 'clsx'

type ChipProps = {
  style?: 'outline' | 'filled'
  size?: 'small' | 'medium' | 'large'
  color?:
    | 'default'
    | 'raspberry'
    | 'honey'
    | 'blueberry'
    | 'greenApple'
    | 'orange'
    | 'midnight'
    | 'powderPink'
    | 'sky'
    | 'lemon'
    | 'lime'
    | 'dreamyPurple'
  label: string
  icon?: ReactNode
  onClick?: (_event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  onRemove?: (_event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
} & React.ButtonHTMLAttributes<HTMLButtonElement>

type ColorVariants = Record<string, string>

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  {
    style = 'filled',
    size = 'medium',
    color = 'default',
    label,
    icon,
    onClick,
    disabled = false,
    onRemove,
    ...props
  }: ChipProps,
  ref,
) {
  const isBlackText =
    (color === 'default' ||
      color === 'powderPink' ||
      color === 'sky' ||
      color === 'lemon' ||
      color === 'dreamyPurple') &&
    style === 'filled'

  const colorFilled: ColorVariants = {
    default: 'bg-gray-300 text-black',
    raspberry: 'bg-raspberry text-white',
    honey: 'bg-honey text-white',
    blueberry: 'bg-blueberry text-white',
    greenApple: 'bg-greenApple text-white',
    orange: 'bg-orange text-white',
    midnight: 'bg-midnight text-white',
    powderPink: 'bg-powderPink text-black',
    sky: 'bg-sky text-black',
    lemon: 'bg-lemon text-black',
    lime: 'bg-lime text-white',
    dreamyPurple: 'bg-dreamyPurple text-black',
  }

  const colorOutline: ColorVariants = {
    default: 'outline-gray-300',
    raspberry: 'outline-raspberry',
    honey: 'outline-honey',
    blueberry: 'outline-blueberry',
    greenApple: 'outline-greenApple',
    orange: 'outline-orange',
    midnight: 'outline-midnight',
    powderPink: 'outline-powderPink',
    sky: 'outline-sky',
    lemon: 'outline-lemon',
    lime: 'outline-lime',
    dreamyPurple: 'outline-dreamyPurple',
  }

  const filled = style === 'filled'

  return (
    <button
      onClick={(e) => (!disabled ? onClick?.(e) : undefined)}
      className={clsx(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-medium tracking-wide transition duration-100',
        'focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:bg-opacity-50',
        filled
          ? `${colorFilled[color]}`
          : `outline outline-offset-0 text-black ${colorOutline[color]}`,
        {
          'text-xs py-1 px-2': size === 'small',
          'text-sm py-1.5 px-4': size === 'medium',
          'text-base py-2 px-6': size === 'large',
        },
        onClick ? 'hover:bg-opacity-80 focus:bg-opacity-60 cursor-pointer' : 'cursor-default',
      )}
      ref={ref}
      {...props}
    >
      {icon && (
        <div
          className={clsx(
            'inline-flex h-5 w-5 items-center justify-center whitespace-nowrap rounded-full text-sm font-medium tracking-wide transition duration-100',
            'focus-visible:outline-none disabled:cursor-not-allowed cursor-pointer',
          )}
          aria-label="icon"
        >
          <span className="relative only:-mx-5">{icon}</span>
        </div>
      )}
      {label}
      {onRemove && (
        <div
          onClick={onRemove}
          className={clsx(
            'inline-flex h-5 w-5 items-center justify-center whitespace-nowrap rounded-full text-sm font-medium tracking-wide transition duration-100',
            'focus-visible:outline-none disabled:cursor-not-allowed cursor-pointer',
            isBlackText
              ? 'hover:bg-gray-500 hover:bg-opacity-20'
              : 'hover:bg-white hover:bg-opacity-20',
          )}
          aria-label="remove chip"
        >
          <span className="relative only:-mx-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              role="graphics-symbol"
              aria-labelledby="title-79 desc-79"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </div>
      )}
    </button>
  )
})
