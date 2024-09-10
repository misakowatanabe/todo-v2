'use client'

import { useAppContext } from 'app/appContext'
import { CreateTodoButton } from './createTodoButton'
import { LabelList } from './labelList'
import { Logout } from './logout'
import { ListItem } from './listItem'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export function Sidemenu() {
  const pathname = usePathname()
  const { todos } = useAppContext()

  const allIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5" />
      <path d="M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16a2 2 0 002-2v-6l-3.4-6.9A2 2 0 0016.8 4H7.2a2 2 0 00-1.8 1.1z" />
    </svg>
  )

  const settingsIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  )

  const clipIcon = (
    <div className="flex justify-center items-center h-12 w-12 bg-black rounded-lg my-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
      </svg>
    </div>
  )

  const allTodosLength = (
    <div
      className={clsx(
        'flex text-xs h-4 min-w-4 justify-center rounded text-black',
        pathname === '/all' ? 'bg-white' : 'bg-gray-200',
        { invisible: todos.length === 0 },
      )}
    >
      {todos.length}
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
          icon={allIcon}
          href="/all"
          pathname={pathname}
          action={allTodosLength}
        />
      </div>
      <hr />
      <LabelList pathname={pathname} />
      <hr />
      <div className="my-3">
        <ListItem label="Settings" icon={settingsIcon} href="/settings" pathname={pathname} />
        <Logout />
      </div>
    </div>
  )
}
