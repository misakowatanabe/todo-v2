import React, { useEffect, useRef, useState } from 'react'
import { Chip } from './Chip'

type DropdownProps = {
  label: string
  items: string[]
  setItems: React.Dispatch<React.SetStateAction<string[]>>
}

export const Dropdown = ({ label, items, setItems }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<number>(0)
  const wrapperRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  const handleClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.currentTarget)) {
      setItems((prev) => [...prev, items[currentItem]])
      setIsOpen(false)
      setCurrentItem(0)
    }
  }

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
        onClick={() => setIsOpen(!isOpen)}
        onMouseLeave={handleMouseLeave}
        ref={wrapperRef}
        aria-expanded={isOpen ? true : false}
      />
      <ul
        className={`${
          isOpen ? 'flex' : 'hidden'
        } absolute top-full z-10 mt-1 flex w-72 list-none flex-col rounded bg-white py-2 shadow-md shadow-gray-500/10 outline outline-offset-0 outline-gray-100`}
      >
        {items.map((item, index) => {
          return (
            <li
              key={index}
              onClick={(e) => handleClick(e)}
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
      </ul>
    </div>
  )
}
