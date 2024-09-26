import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom'
import clsx from 'clsx'

type DrawerProps = {
  openButton?: ReactNode
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isOpen: boolean
  children: ReactNode
  className?: string
}

export function Drawer({ openButton, setIsOpen, isOpen, children, className }: DrawerProps) {
  return (
    <>
      {openButton}
      {isOpen && typeof document !== 'undefined'
        ? ReactDOM.createPortal(
            <div className={className}>
              <aside
                id="basic-drawer"
                aria-label="Side drawer"
                className={clsx(
                  'flex fixed top-0 bottom-0 right-0 w-2/4 px-8 z-30 flex-col bg-white transition-transform',
                  isOpen ? '-translate-x-0' : 'translate-x-full w-0',
                )}
              >
                {children}
              </aside>
              <div
                className={clsx(
                  'fixed top-0 bottom-0 left-0 right-0 z-20 bg-gray-900/20 transition-colors',
                  isOpen ? 'block' : 'hidden',
                )}
                onClick={() => setIsOpen(false)}
              ></div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
