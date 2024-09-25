import React from 'react'
import clsx from 'clsx'

type NavigationLayoutProps = {
  sidemenu: React.ReactNode
  mobileAppBar: React.ReactNode
  setIsSideNavOpen: React.Dispatch<React.SetStateAction<boolean>>
  isSideNavOpen: boolean
  appBar: React.ReactNode
}

export function NavigationLayout({
  sidemenu,
  mobileAppBar,
  setIsSideNavOpen,
  isSideNavOpen,
  appBar,
}: NavigationLayoutProps) {
  return (
    <>
      <header className="block lg:hidden z-20 fixed top-0 left-0 right-0">{mobileAppBar}</header>
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
        <header className="hidden lg:block lg:fixed top-0 left-72 right-0 bg-white px-2 lg:px-8 z-10">
          {appBar}
        </header>
      </div>
    </>
  )
}
