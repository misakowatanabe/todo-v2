import React, { useEffect, useRef, useState } from 'react'
// import clsx from 'clsx'

interface ButtonProps {
  // style?: 'primary' | 'secondary' | 'text'
  // size?: 'small' | 'medium' | 'large'
  // backgroundColor?: string
  // label: string
  // type?: 'button' | 'submit' | 'reset'
  // onClick?: (_event: React.MouseEvent<HTMLButtonElement>) => void
  // disabled?: boolean
  // form?: string
}

export const Dropdown = (
  {
    // style = 'primary',
    // size = 'medium',
    // backgroundColor,
    // label,
    // type = 'button',
    // onClick,
    // disabled,
    // form,
    // ...props
  }: ButtonProps,
) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<number>(0)
  const wrapperRef = useRef<HTMLButtonElement>(null)

  const navigationItems = [
    {
      linkName: 'Dashboard',
    },
    {
      linkName: 'Metrics and analytics',
    },
    {
      linkName: 'Multi-Channel Funnels overview',
    },
    {
      linkName: 'User settings',
    },
    {
      linkName: 'User Profile',
    },
  ]

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
        setCurrentItem(0)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isOpen) {
      e.preventDefault()

      switch (e.key) {
        case 'ArrowDown':
          if (currentItem === navigationItems.length - 1) {
            setCurrentItem(0)
          } else {
            setCurrentItem(currentItem + 1)
          }
          break
        case 'ArrowUp':
          if (currentItem === 0) {
            setCurrentItem(navigationItems.length - 1)
          } else {
            setCurrentItem(currentItem - 1)
          }
          break
        case 'Escape':
          setCurrentItem(1)
          setIsOpen(false)
          break
        case 'Enter':
          // pick item
          setIsOpen(false)

          if (wrapperRef.current == null) return

          wrapperRef.current.blur()
          break
        default:
          break
      }
    }
  }

  const handleMouseEvent = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault()

    const index = e.currentTarget.dataset.index
    if (index == null) return

    const indexNumber = parseInt(index, 10)
    setCurrentItem(indexNumber)
  }

  const handleMouseLeave = () => {
    if (isOpen || wrapperRef.current == null) return

    wrapperRef.current.blur()
  }

  return (
    <div className="relative inline-flex" id="dropdown">
      <button
        className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-emerald-500 px-5 text-sm font-medium tracking-wide text-white transition duration-100 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen ? true : false}
        ref={wrapperRef}
        onMouseLeave={handleMouseLeave}
      >
        Choose one
      </button>
      <ul
        className={`${
          isOpen ? 'flex' : 'hidden'
        } absolute top-full z-10 mt-1 flex w-72 list-none flex-col rounded bg-white py-2 shadow-md shadow-slate-500/10 `}
      >
        {navigationItems.map((item, index) => {
          return (
            <li
              key={index}
              onMouseEnter={(e) => handleMouseEvent(e)}
              data-index={index}
              className={`${
                index === currentItem ? 'bg-emerald-50 text-emerald-500' : 'bg-none text-slate-500'
              } flex items-start justify-start gap-2 p-2 px-5 transition-colors`}
            >
              <span className="flex flex-col gap-1 overflow-hidden whitespace-nowrap">
                <span className="truncate leading-5">{item.linkName}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
