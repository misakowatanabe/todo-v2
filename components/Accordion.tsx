import React from 'react'
import { useState } from 'react'
import clsx from 'clsx'
import { Icon } from 'components/icons'

type AccordionProps = {
  children: React.ReactNode
  label: string
  itemLength?: number
  testid?: string
}

export function Accordion({ children, label, itemLength, testid }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="py-2">
      <h2>
        <button
          className="flex items-center gap-1 w-full text-left text-gray-500 pb-2"
          onClick={(e) => {
            e.preventDefault()
            setIsOpen(!isOpen)
          }}
          aria-expanded={isOpen}
          aria-controls="basic-accordion"
          data-testid={testid}
        >
          <span className="font-semibold">{label}</span>
          {itemLength != null && <span className="font-medium">{`(${itemLength})`}</span>}
          <Icon.ChevronUp
            size={{ width: 24, height: 24 }}
            className={clsx('transform origin-center transition duration-100 ease-out', {
              '!rotate-180': isOpen,
            })}
          />
        </button>
      </h2>
      <div
        id="basic-accordion"
        role="region"
        aria-labelledby={`accordion-contents`}
        className={`grid overflow-hidden transition-all duration-100 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
