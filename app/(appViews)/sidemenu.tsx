'use client'

import CreateTodo from './createTodo'
import LabelList from './labelList'
import Logout from './logout'
import { ListItem } from './listItem'
import { usePathname } from 'next/navigation'

export default function Sidemenu() {
  const pathname = usePathname()

  const LabelIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 text-gray-700"
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      />
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
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
      </svg>
    </div>
  )

  return (
    <div className="w-72 flex flex-col flex-none px-3 bg-[#F9F9F9]">
      <div className="mb-4 mx-3 flex flex-col items-center">
        {clipIcon}
        <CreateTodo />
      </div>
      <div className="my-3">
        <ListItem label="All" icon={LabelIcon} href="/all" pathname={pathname} />
      </div>
      <hr />
      <LabelList pathname={pathname} />
      <hr />
      <div className="my-3">
        <ListItem label="Account" icon={LabelIcon} href="/account" pathname={pathname} />
        <Logout />
      </div>
    </div>
  )
}
