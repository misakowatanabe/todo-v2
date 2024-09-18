'use client'

import { useAppContext } from 'app/appContext'
import clsx from 'clsx'
import { CreateLabelButton } from './createLabelButton'
import { RemoveLabelButton } from './removeLabelButton'
import { ListItem } from './listItem'
import { NumberNotification } from './numberNotification'
import { Icon } from 'components/icons'
import { Todo } from 'app/actions'

type ColorVariants = Record<string, string>

type LabelColor = { labelColor: string }

type LabelListProps = { pathname: string }

export function getTodoLength(label: string, todos: Todo[]) {
  return todos.filter((el) => {
    if (!el.labels) return false

    return el.labels.includes(label)
  })
}

export function LabelList({ pathname }: LabelListProps) {
  const { labels, todos } = useAppContext()

  if (todos == null || labels == null)
    return (
      <div className="grow">
        <div className="text-sm text-gray-500 mt-6 mx-3">Labels</div>
        {Array.from(Array(3).keys()).map((idx) => (
          <ListItem key={idx} skeleton={true} />
        ))}
      </div>
    )

  // const getTodoLength = (label: string) => {
  //   return todos.filter((el) => {
  //     if (!el.labels) return false

  //     return el.labels.includes(label)
  //   })
  // }

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
    <Icon.Label
      size="medium"
      fill={true}
      className={clsx('rotate-[135deg]', `${color[labelColor]}`)}
    />
  )

  return (
    <div className="grow">
      <div className="text-sm text-gray-500 mt-6 mx-3">Labels</div>
      {labels.map((el, idx) => {
        const currentPath = pathname
          ?.toLowerCase()
          .replace(/_/g, ' ')
          .endsWith(el.label.toLowerCase())

        const todoLength = getTodoLength(el.label, todos).length

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
