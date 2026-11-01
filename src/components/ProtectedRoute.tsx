import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAppSelector } from '../app/hooks'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const status = useAppSelector((state) => state.account.status)
  const location = useLocation()

  if (status === 'initializing') {
    return (
      <main className="flex min-h-0 flex-1 items-center justify-center">
        <p role="status" className="text-sm text-secondary">
          Checking your account…
        </p>
      </main>
    )
  }

  if (status === 'anonymous') {
    const next = `${location.pathname}${location.search}${location.hash}`
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />
  }

  return children
}
