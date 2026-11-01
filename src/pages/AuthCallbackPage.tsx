import { Alert } from '@openai/apps-sdk-ui/components/Alert'
import { ButtonLink } from '@openai/apps-sdk-ui/components/Button'
import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { restorePendingCart } from '../features/auth/pendingCart'
import { getSafeInternalPath } from '../utils/redirects'

export function AuthCallbackPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const status = useAppSelector((state) => state.account.status)
  const handled = useRef(false)
  const showError = status === 'anonymous'

  useEffect(() => {
    if (handled.current || status === 'initializing') return

    if (status === 'authenticated') {
      handled.current = true
      const restoredCart = restorePendingCart(dispatch)
      const next = getSafeInternalPath(searchParams.get('next'))
      navigate(restoredCart ? '/cart' : next, { replace: true })
      return
    }
  }, [dispatch, navigate, searchParams, status])

  return (
    <main className="flex min-h-0 flex-1 items-center justify-center py-6">
      <div className="w-full max-w-md">
        {showError ? (
          <Alert
            color="danger"
            title="We couldn’t confirm your email"
            description="The confirmation link may have expired or already been used. Please log in or try signing up again."
          />
        ) : (
          <p role="status" className="text-center text-sm text-secondary">
            Confirming your account…
          </p>
        )}
        {showError && (
          <div className="mt-5 flex gap-3">
            <ButtonLink to="/login" color="primary">
              Login
            </ButtonLink>
            <ButtonLink to="/signup" color="secondary" variant="outline">
              Sign up again
            </ButtonLink>
          </div>
        )}
      </div>
    </main>
  )
}
