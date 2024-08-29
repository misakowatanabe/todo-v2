import React, { ReactNode, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Button } from './Button'

type HeaderProps = { setIsShowing: React.Dispatch<React.SetStateAction<boolean>>; title: string }

type FooterProps = {
  setIsShowing: React.Dispatch<React.SetStateAction<boolean>>
  okButton: ReactNode
}

type ModalProps = {
  openButton?: ReactNode
  okButton: ReactNode
  setIsShowing: React.Dispatch<React.SetStateAction<boolean>>
  isShowing: boolean
  title: string
  children: ReactNode
}

function Header({ setIsShowing, title }: HeaderProps) {
  return (
    <header id="header-4a" className="flex items-center">
      <h3 className="flex-1 text-lg font-medium text-gray-700">{title}</h3>
      <button
        onKeyDown={(e) => {
          if (e.key === 'Enter') setIsShowing(false)
        }}
        onClick={() => setIsShowing(false)}
        className="inline-flex h-10 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full px-5 text-sm font-medium tracking-wide  text-gray-500 transition duration-100 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-200 focus:text-gray-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-gray-300 disabled:shadow-none disabled:hover:bg-transparent"
        aria-label="close dialog"
      >
        <span className="relative only:-mx-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            role="graphics-symbol"
            aria-labelledby="title-79 desc-79"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      </button>
    </header>
  )
}

function Footer({ okButton, setIsShowing }: FooterProps) {
  return (
    <div className="flex justify-start gap-2">
      {okButton}
      <Button
        onClick={() => setIsShowing(false)}
        label="Cancel"
        style="text"
        onKeyDown={(e) => {
          if (e.key === 'Enter') setIsShowing(false)
        }}
      />
    </div>
  )
}

export default function Modal({
  openButton,
  okButton,
  setIsShowing,
  isShowing,
  title,
  children,
}: ModalProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsShowing(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef, setIsShowing])

  useEffect(() => {
    let html = document.querySelector('html')

    if (html) {
      if (isShowing && html) {
        html.style.overflowY = 'hidden'

        const focusableElements =
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        // select the modal by its id
        const modal = document.querySelector('#modal')

        if (modal) {
          // get first element to be focused inside modal
          const firstFocusableElement = modal.querySelectorAll(focusableElements)[0] as HTMLElement
          const focusableContent = modal.querySelectorAll(focusableElements)
          // get last element to be focused inside modal
          const lastFocusableElement = focusableContent[focusableContent.length - 1] as HTMLElement

          document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
              setIsShowing(false)
            }

            let isTabPressed = e.key === 'Tab'

            if (!isTabPressed) {
              return
            }

            if (e.shiftKey) {
              // if shift key pressed for shift + tab combination
              if (document.activeElement === firstFocusableElement) {
                // add focus for the last focusable element
                lastFocusableElement.focus()
                e.preventDefault()
              }
            } else {
              // if tab key is pressed
              if (document.activeElement === lastFocusableElement) {
                // if focused has reached to last focusable element then focus first focusable element after pressing tab
                // add focus for the first focusable element
                firstFocusableElement.focus()
                e.preventDefault()
              }
            }
          })

          firstFocusableElement.focus()
        }
      } else {
        html.style.overflowY = 'visible'
      }
    }
  }, [isShowing, setIsShowing])

  return (
    <>
      {openButton}
      {isShowing && typeof document !== 'undefined'
        ? ReactDOM.createPortal(
            <div
              className="fixed top-0 left-0 z-20 flex h-screen w-screen items-center justify-center bg-gray-400/40 backdrop-blur-sm"
              aria-labelledby="header-4a content-4a"
              aria-modal="true"
              tabIndex={-1}
              role="dialog"
            >
              <div
                ref={wrapperRef}
                className="flex max-h-[90vh] w-3/4 lg:w-2/4 flex-col gap-4 overflow-hidden rounded bg-white p-6 text-gray-500 shadow-xl shadow-gray-700/10"
                id="modal"
                role="document"
              >
                <Header setIsShowing={setIsShowing} title={title} />
                <div id="content-4a" className="flex-1">
                  {children}
                </div>
                <Footer setIsShowing={setIsShowing} okButton={okButton} />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
