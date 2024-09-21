import React, { ReactNode, forwardRef } from 'react'
import clsx from 'clsx'
import { Icon } from 'components/icons'

export const colorOptions = [
  'default',
  'raspberry',
  'honey',
  'blueberry',
  'greenApple',
  'orange',
  'midnight',
  'powderPink',
  'sky',
  'lemon',
  'lime',
  'dreamyPurple',
] as const

export type ChipColor = (typeof colorOptions)[number]

type ChipProps = {
  style?: 'outline' | 'filled'
  size?: 'small' | 'medium' | 'large'
  color?: ChipColor
  label: string
  icon?: ReactNode
  onClick?: (_event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  onRemove?: (_event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  testid?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export type ColorVariants = Record<ChipColor, string>

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
    testid,
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
        'inline-flex items-center justify-center gap-2 w-fit whitespace-nowrap rounded font-medium tracking-wide transition duration-100',
        'disabled:cursor-not-allowed disabled:bg-opacity-50',
        filled
          ? `${colorFilled[color]}`
          : `outline outline-offset-0 text-black ${colorOutline[color]}`,
        {
          'text-xs px-2 h-6': size === 'small',
          'text-sm px-4 h-8': size === 'medium',
          'text-base px-6 h-10': size === 'large',
        },
        onClick
          ? 'hover:bg-opacity-80 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500'
          : 'cursor-default focus-visible:outline-none',
      )}
      ref={ref}
      data-testid={testid}
    >
      {icon && (
        <div
          className={clsx(
            'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium tracking-wide transition duration-100',
            'focus-visible:outline-none disabled:cursor-not-allowed cursor-pointer',
            {
              'h-3 w-3': size === 'small',
              'h-4 w-4': size === 'medium',
              'h-[18px] w-[18px]': size === 'large',
            },
          )}
          aria-label="icon"
        >
          {icon}
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
          <Icon.Close size={size} />
        </div>
      )}
    </button>
  )
})
