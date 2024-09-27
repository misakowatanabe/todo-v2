'use client'

import { useAppContext } from 'app/appContext'
import { Alert } from 'components/Alert'

export function GlobalAlert() {
  const { globalError, setGlobalError } = useAppContext()

  return <Alert severity="critical" message={globalError} onClose={() => setGlobalError(null)} />
}
