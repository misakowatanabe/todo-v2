'use client'

import { Sidemenu } from './sidemenu'
import { useEffect, useState, useTransition } from 'react'
import clsx from 'clsx'
import { NavigationLayout } from 'components/NavigationLayout'
import { Icon } from 'components/icons'
import { Button } from 'components/Button'
import { usePathname } from 'next/navigation'
import { useAppContext } from 'app/appContext'
import { Heading } from 'components/Heading'
import { DropdownMenu, MenuItem } from 'components/DropdownMenu'
import { deleteCompletedTodos } from 'app/(appViews)/(todo)/deleteCompletedTodos'
import { ButtonSwitcher } from 'components/ButtonSwitcher'
import { Fab } from 'components/Fab'

export function Nav() {
  const pathname = usePathname()
  const [title, setTitle] = useState<string | null>(null)
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)
  const { completedTodos, setView, view, user, setGlobalError } = useAppContext()
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setIsSideNavOpen(false)
    let titleString = (pathname.split('/').pop() ?? '').replace(/_/g, ' ')

    // Change the first letter to capital unless curret path is one of the labels
    if (pathname.split('/').length === 2) {
      titleString = (titleString[0].toUpperCase() + titleString.slice(1)).replace(/_/g, ' ')
    }

    setTitle(titleString)
  }, [pathname])

  const handleDeleteCompleted = () => {
    setGlobalError(null)

    if (!user) return

    startTransition(async () => {
      const res = await deleteCompletedTodos(user.uid)

      if (!res.ok) {
        setGlobalError(res.error)
      }
    })
  }

  const showViewSwitcher = title !== 'Settings'
  const showDeleteCompleted = title === 'All'

  const appBarMenuItems: MenuItem[] = [
    {
      label: 'Delete completed todos',
      onClick: handleDeleteCompleted,
      disabled: (isPending || (completedTodos && completedTodos.length === 0)) ?? undefined,
    },
  ]

  const appBarActions = (
    <div className="flex gap-2.5">
      {/* completed todos deletion is available only on "All" view for now */}
      {showDeleteCompleted && (
        <DropdownMenu
          icon={<Icon.Ellipsis size="medium" />}
          items={appBarMenuItems}
          alignment="right"
        />
      )}
      {showViewSwitcher && (
        <ButtonSwitcher
          // one on the right is selected when checked
          onChange={(e: any) => setView(e.target.checked ? 'card' : 'table')}
          left={{ icon: <Icon.List /> }}
          right={{ icon: <Icon.Grid /> }}
          checked={view === 'card' ? true : false}
          testid="switch-view"
        />
      )}
    </div>
  )

  const appBar = <Heading title={title ?? ''} action={appBarActions} />

  const mobileAppBarMenuItems: MenuItem[] = []

  if (showDeleteCompleted) {
    mobileAppBarMenuItems.push({
      label: 'Delete completed todos',
      onClick: handleDeleteCompleted,
      disabled: (isPending || (completedTodos && completedTodos.length === 0)) ?? undefined,
    })
  }

  if (showViewSwitcher) {
    mobileAppBarMenuItems.push({
      label: `Change to ${view === 'table' ? 'card' : 'table'} view`,
      onClick: () => setView((prev) => (prev === 'table' ? 'card' : 'table')),
    })
  }

  const mobileAppBar = (
    <div className="py-2 px-1 flex justify-between bg-[#F9F9F9]">
      <div className="flex gap-1 items-center">
        <Button
          onClick={() => setIsSideNavOpen(!isSideNavOpen)}
          icon={<Icon.Menu />}
          style="text"
          size="large"
          className={clsx('', {
            visible: isSideNavOpen,
          })}
          aria-expanded={isSideNavOpen ? true : false}
          aria-haspopup="menu"
        />
        <div className="text-xl font-bold">{title}</div>
      </div>
      {/* mobile app bar actions */}
      {mobileAppBarMenuItems.length !== 0 && (
        <DropdownMenu
          icon={<Icon.Ellipsis size="medium" />}
          items={mobileAppBarMenuItems}
          alignment="right"
        />
      )}
    </div>
  )

  return (
    <>
      <NavigationLayout
        sidemenu={<Sidemenu />}
        setIsSideNavOpen={setIsSideNavOpen}
        isSideNavOpen={isSideNavOpen}
        mobileAppBar={mobileAppBar}
        appBar={appBar}
      />
      <div className="lg:hidden">
        <Fab icon={<Icon.Plus />} testid="create-todo" />
      </div>
    </>
  )
}
