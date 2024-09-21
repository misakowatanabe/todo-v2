'use client'

import { useAppContext } from 'app/appContext'
import { CreateTodoButton } from './createTodoButton'
import { LabelList } from './labelList'
import { Logout } from './logout'
import { ListItem } from './listItem'
import { usePathname } from 'next/navigation'
import { NumberNotification } from './numberNotification'
import { Icon } from 'components/icons'

export function Sidemenu() {
  const pathname = usePathname()
  const { todos } = useAppContext()

  const clipIcon = (
    <div className="flex justify-center items-center h-12 w-12 bg-black rounded-lg my-6">
      <Icon.Clip stroke="#ffffff" size={{ width: 24, height: 24 }} />
    </div>
  )

  return (
    <div className="sticky top-0 left-0 overflow-y-auto h-screen w-72 flex flex-col flex-none px-3 bg-[#F9F9F9]">
      <div className="mb-4 mx-3 flex flex-col items-center">
        {clipIcon}
        <CreateTodoButton />
      </div>
      <div className="my-3">
        <ListItem
          label="All"
          icon={<Icon.Inbox size="medium" />}
          href="/all"
          pathname={pathname}
          action={
            <NumberNotification isCurrentPath={pathname === '/all'} todoLength={todos?.length} />
          }
          testid="sidemenu-all"
        />
      </div>
      <hr />
      <LabelList pathname={pathname} />
      <hr />
      <div className="my-3">
        <ListItem
          label="Settings"
          icon={<Icon.Settings size="medium" />}
          href="/settings"
          pathname={pathname}
        />
        <Logout />
      </div>
    </div>
  )
}
