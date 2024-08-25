import React, { ReactNode } from 'react'
import clsx from 'clsx'

type DrawerProps = {
  openButton?: ReactNode
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isOpen: boolean
  children: ReactNode
}

export default function Drawer({ openButton, setIsOpen, isOpen, children }: DrawerProps) {
  return (
    <>
      {openButton}
      <aside
        id="basic-drawer"
        aria-label="Side drawer"
        className={clsx(
          'fixed top-0 bottom-0 right-0 flex w-2/5 px-8 z-40 flex-col bg-white transition-transform',
          isOpen ? '-translate-x-0' : 'translate-x-full w-0',
        )}
      >
        {children}
      </aside>
      <div
        className={`fixed top-0 bottom-0 left-0 right-0 z-30 bg-gray-900/20 transition-colors ${
          isOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>
    </>
  )
}
