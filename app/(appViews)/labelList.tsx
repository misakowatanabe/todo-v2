'use client'

import Link from 'next/link'
import { useAppContext } from 'app/appContext'
import clsx from 'clsx'
import CreateLabel from './createLabel'
import RemoveLabel from './removeLabel'

type ColorVariants = Record<string, string>

type LabelColor = { labelColor: string }

export default function LabelList() {
  const { labels } = useAppContext()

  // TODO: use single source of truth
  const color: ColorVariants = {
    default: 'text-gray-300',
    raspberry: 'text-raspberry',
    honey: 'text-honey',
    blueberry: 'text-blueberry',
    greenApple: 'text-greenApple',
    orange: 'text-orange',
    midnight: 'text-midnight',
    powderPink: 'text-powderPink',
    sky: 'text-sky',
    lemon: 'text-lemon',
    lime: 'text-lime',
    dreamyPurple: 'text-dreamyPurple',
  }

  const LabelIcon = ({ labelColor }: LabelColor) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={clsx('h-5 w-5', `${color[labelColor]}`)}
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      />
    </svg>
  )

  return (
    <>
      {labels.map((el) => (
        <div key={el.label} className="flex justify-between items-center">
          <Link
            href={`/label/${el.label.replace(/ /g, '_').toLowerCase()}`}
            className="flex justify-start gap-3 w-full items-center"
          >
            <LabelIcon labelColor={el.color} />
            <div>{el.label}</div>
          </Link>
          <RemoveLabel label={el.label} />
        </div>
      ))}
      <CreateLabel />
    </>
  )
}
