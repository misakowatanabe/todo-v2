import React from 'react'
import clsx from 'clsx'

type NavigationLayoutProps = {
  sidemenu: React.ReactNode
  appBar: React.ReactNode
  setIsSideNavOpen: React.Dispatch<React.SetStateAction<boolean>>
  isSideNavOpen: boolean
}

export function NavigationLayout({
  sidemenu,
  appBar,
  setIsSideNavOpen,
  isSideNavOpen,
}: NavigationLayoutProps) {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 block lg:hidden py-2 px-1 z-20 bg-[#F9F9F9]">
        {appBar}
      </header>
      <div className="flex">
        <aside
          id="nav-menu-1"
          aria-label="Side navigation"
          className={clsx(
            'sticky top-0 left-0 h-screen overflow-y-auto px-3 z-40 flex flex-none w-72 flex-col bg-[#F9F9F9] transition-transform lg:translate-x-0',
            isSideNavOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          {sidemenu}
        </aside>
        <div
          className={`fixed top-0 bottom-0 left-0 right-0 z-30 lg:hidden bg-gray-900/20 transition-colors ${
            isSideNavOpen ? 'block' : 'hidden'
          }`}
          onClick={() => setIsSideNavOpen(false)}
        ></div>
      </div>
    </>
  )
}
