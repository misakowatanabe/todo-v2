import React from 'react'
import { Icon } from './icons'

export function Spinner() {
  return (
    <Icon.Spinner
      size={{ width: 40, height: 40 }}
      className="animate-spin"
      aria-busy="true"
      aria-live="polite"
    />
  )
}
