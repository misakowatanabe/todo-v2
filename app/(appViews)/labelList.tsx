'use client'

import { useAppContext } from 'app/appContext'
import clsx from 'clsx'
import { CreateLabelButton } from './createLabelButton'
import { RemoveLabelButton } from './removeLabelButton'
import { ListItem } from './listItem'
import { NumberNotification } from './numberNotification'

type ColorVariants = Record<string, string>

type LabelColor = { labelColor: string }

type LabelListProps = { pathname: string }

export function LabelList({ pathname }: LabelListProps) {
  const { labels, todos } = useAppContext()

  if (todos == null || labels == null)
    return (
      <div className="grow">
        <div className="text-sm text-gray-500 mt-6 mx-3">Labels</div>
        {Array.from(Array(3).keys()).map((idx) => (
          <ListItem key={idx} skelton={true} />
        ))}
      </div>
    )

  const getTodoLength = (label: string) => {
    return todos.filter((el) => {
      if (!el.labels) return false

      return el.labels.includes(label)
    })
  }

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
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="currentColor"
      rotate={180}
      stroke={color[labelColor]}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx('h-5 w-5 rotate-[135deg]', `${color[labelColor]}`)}
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
      <line x1="7" y1="7" x2="7.01" y2="7"></line>
    </svg>
  )

  return (
    <div className="grow">
      <div className="text-sm text-gray-500 mt-6 mx-3">Labels</div>
      {labels.map((el, idx) => {
        const currentPath = pathname
          ?.toLowerCase()
          .replace(/_/g, ' ')
          .endsWith(el.label.toLowerCase())

        const todoLength = getTodoLength(el.label).length

        return (
          <ListItem
            key={idx}
            label={el.label}
            icon={<LabelIcon labelColor={el.color} />}
            href={`/label/${el.label.replace(/ /g, '_')}`}
            action={
              <div className="flex gap-1 items-center">
                <RemoveLabelButton label={el.label} />
                <NumberNotification isCurrentPath={currentPath} todoLength={todoLength} />
              </div>
            }
            pathname={pathname}
          />
        )
      })}
      <CreateLabelButton />
    </div>
  )
}
