'use client' // Error components must be Client Components

import ErrorUI from '@components/Objects/StyledElements/Error/Error'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error caught by error boundary:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
  }, [error])

  return (
    <div>
      <ErrorUI message="Data loading failed" submessage={error.message}></ErrorUI>
    </div>
  )
}
