import React, { ReactNode, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Button } from './Button'
import { Icon } from './icons'

type ModalFullProps = {
  openButton?: ReactNode
  actions?: ReactNode
  setIsShowing: React.Dispatch<React.SetStateAction<boolean>>
  isShowing: boolean
  closeable?: boolean
  children: ReactNode
}

export function ModalFull({
  openButton,
  actions,
  setIsShowing,
  isShowing,
  closeable = true,
  children,
}: ModalFullProps) {
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
            if (e.key === 'Escape' && closeable) {
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
  }, [isShowing, setIsShowing, closeable])

  return (
    <>
      {openButton}
      {isShowing && typeof document !== 'undefined'
        ? ReactDOM.createPortal(
            <div
              className="fixed top-0 bottom-0 left-0 right-0 z-20 flex flex-col h-screen w-screen bg-white"
              aria-labelledby="header-4a content-4a"
              aria-modal="true"
              tabIndex={-1}
              role="dialog"
              id="modal"
            >
              <div className="py-2 px-1 flex justify-between bg-[#F9F9F9]">
                <Button
                  onClick={() => setIsShowing(false)}
                  icon={<Icon.ArrowLeft />}
                  style="text"
                  size="large"
                  aria-expanded={isShowing ? true : false}
                  aria-haspopup="menu"
                />
                {actions}
              </div>
              <div className="grow mx-2">{children}</div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
