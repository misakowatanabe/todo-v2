import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { Chip } from './Chip'

type DropdownProps = {
  label: string
  items: string[]
  setItems: React.Dispatch<React.SetStateAction<string[]>>
  icon?: ReactNode
  testid?: string
}

export const Dropdown = ({ label, items, setItems, icon, testid }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<number>(0)
  const wrapperRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      // Open/close the dropdown when clicking chip button
      if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
        setIsOpen((prev) => !prev)
        setCurrentItem(0)
      }

      // Close the dropdown when clicking outside
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen((prev) => {
          if (!prev) return prev
          else return false
        })
        setCurrentItem((prev) => {
          if (prev === 0) return prev
          else return 0
        })
      }

      // Add an item at the end when clicking one of the dropdown items
      if (dropdownRef.current && dropdownRef.current.contains(e.target)) {
        setItems((prev) => [...prev, items[currentItem]])
        setIsOpen(false)
        setCurrentItem(0)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef, currentItem, items, setItems])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isOpen) {
      e.preventDefault()

      switch (e.key) {
        case 'ArrowDown':
          if (currentItem === items.length - 1) {
            setCurrentItem(0)
          } else {
            setCurrentItem(currentItem + 1)
          }
          break
        case 'ArrowUp':
          if (currentItem === 0) {
            setCurrentItem(items.length - 1)
          } else {
            setCurrentItem(currentItem - 1)
          }
          break
        case 'Escape':
          setCurrentItem(1)
          setIsOpen(false)
          break
        case 'Enter':
          setItems((prev) => [...prev, items[currentItem]])
          setIsOpen(false)
          setCurrentItem(0)

          if (wrapperRef.current == null) return

          wrapperRef.current.blur()
          break
        default:
          break
      }
    }
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLLIElement>) => {
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
      <Chip
        label={label}
        icon={icon}
        // only to satisfy visual effect as a clickable button
        onClick={() => {}}
        onMouseLeave={handleMouseLeave}
        ref={wrapperRef}
        aria-expanded={isOpen ? true : false}
        testid={testid}
      />
      <ul
        ref={dropdownRef}
        className={`${
          isOpen ? 'flex' : 'hidden'
        } absolute top-full z-10 mt-1 flex w-72 list-none flex-col rounded bg-white py-2 shadow-md shadow-gray-500/10 outline outline-offset-0 outline-gray-100`}
      >
        {items.length === 0 ? (
          <li className="flex items-start justify-start gap-2 p-2 px-5 transition-colors">
            <span className="flex flex-col gap-1 overflow-hidden whitespace-nowrap">
              <span className="truncate leading-5 text-gray-400">No item</span>
            </span>
          </li>
        ) : (
          <>
            {items.map((item, index) => {
              return (
                <li
                  key={index}
                  onMouseEnter={(e) => handleMouseEnter(e)}
                  data-index={index}
                  className={`${
                    index === currentItem ? 'bg-gray-100' : 'bg-none text-slate-500'
                  } flex items-start justify-start gap-2 p-2 px-5 transition-colors cursor-pointer`}
                >
                  <span className="flex flex-col gap-1 overflow-hidden whitespace-nowrap">
                    <span className="truncate leading-5">{item}</span>
                  </span>
                </li>
              )
            })}
          </>
        )}
      </ul>
    </div>
  )
}
