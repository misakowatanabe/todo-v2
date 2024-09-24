'use client'

import { Sidemenu } from './sidemenu'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { NavigationLayout } from 'components/NavigationLayout'
import { Icon } from 'components/icons'
import { Button } from 'components/Button'
import { usePathname } from 'next/navigation'

export function Nav() {
  const pathname = usePathname()

  useEffect(() => {
    setIsSideNavOpen(false)
  }, [pathname])

  const [isSideNavOpen, setIsSideNavOpen] = useState(false)

  const appBarContents = (
    <Button
      onClick={() => setIsSideNavOpen(!isSideNavOpen)}
      icon={<Icon.Plus />}
      style="text"
      size="large"
      className={clsx('', {
        visible: isSideNavOpen,
      })}
      aria-expanded={isSideNavOpen ? true : false}
      aria-haspopup="menu"
      aria-label="Side navigation"
    />
  )

  return (
    <NavigationLayout
      sidemenu={<Sidemenu />}
      setIsSideNavOpen={setIsSideNavOpen}
      isSideNavOpen={isSideNavOpen}
      appBar={appBarContents}
    />
  )
}
