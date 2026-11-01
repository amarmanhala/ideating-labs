import { Alert } from '@openai/apps-sdk-ui/components/Alert'
import { Button } from '@openai/apps-sdk-ui/components/Button'
import { Input } from '@openai/apps-sdk-ui/components/Input'
import { TextLink } from '@openai/apps-sdk-ui/components/TextLink'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setAuthenticated } from '../features/account/accountSlice'
import { restorePendingCart } from '../features/auth/pendingCart'
import { accountFromUser } from '../features/auth/user'
import {
  supabase,
  supabaseConfigurationError,
} from '../lib/supabase'
import { getSafeInternalPath } from '../utils/redirects'

function getAuthErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase()

  if (normalizedMessage.includes('invalid login credentials')) {
    return 'The email or password is incorrect.'
  }
  if (normalizedMessage.includes('email not confirmed')) {
    return 'Confirm your email before logging in.'
  }
  if (normalizedMessage.includes('already registered')) {
    return 'An account with this email already exists. Try logging in instead.'
  }
  if (normalizedMessage.includes('password')) {
    return 'Use a password with at least 8 characters.'
  }
  if (normalizedMessage.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment and try again.'
  }

  return 'We couldn’t complete that request. Check your connection and try again.'
}

export function AccountPage({ mode }: { mode: 'login' | 'signup' }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const authStatus = useAppSelector((state) => state.account.status)
  const authAttemptInProgress = useRef(false)
  const handledAuthentication = useRef(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(
    null,
  )
  const isSignUp = mode === 'signup'
  const title = isSignUp ? 'Sign Up' : 'Login'
  const next = getSafeInternalPath(searchParams.get('next'))
  const alternatePath = `${isSignUp ? '/login' : '/signup'}${
    next === '/' ? '' : `?next=${encodeURIComponent(next)}`
  }`

  useEffect(() => {
    if (
      authStatus !== 'authenticated' ||
      authAttemptInProgress.current ||
      handledAuthentication.current
    ) {
      return
    }

    handledAuthentication.current = true
    void restorePendingCart(dispatch).then((restoredCart) => {
      navigate(restoredCart ? '/cart' : next, { replace: true })
    })
  }, [authStatus, dispatch, navigate, next])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    if (!supabase) {
      setErrorMessage(supabaseConfigurationError)
      return
    }

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    const name = String(formData.get('name') ?? '').trim()

    if (!email || !password || (isSignUp && !name)) {
      setErrorMessage('Complete all required fields.')
      return
    }
    if (password.length < 8) {
      setErrorMessage('Use a password with at least 8 characters.')
      return
    }

    setIsSubmitting(true)
    authAttemptInProgress.current = true

    try {
      if (isSignUp) {
        const callbackUrl = new URL('/auth/callback', window.location.origin)
        if (next !== '/') callbackUrl.searchParams.set('next', next)

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: callbackUrl.toString(),
          },
        })

        if (error) throw error
        if (data.user?.identities?.length === 0) {
          setErrorMessage(
            'An account with this email already exists. Try logging in instead.',
          )
          return
        }
        if (data.session && data.user) {
          handledAuthentication.current = true
          dispatch(setAuthenticated(accountFromUser(data.user)))
          const restoredCart = await restorePendingCart(dispatch)
          navigate(restoredCart ? '/cart' : next, { replace: true })
          return
        }

        setConfirmationEmail(email)
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      handledAuthentication.current = true
      dispatch(setAuthenticated(accountFromUser(data.user)))
      const restoredCart = await restorePendingCart(dispatch)
      navigate(restoredCart ? '/cart' : next, { replace: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      setErrorMessage(getAuthErrorMessage(message))
    } finally {
      authAttemptInProgress.current = false
      setIsSubmitting(false)
    }
  }

  if (confirmationEmail) {
    return (
      <main className="flex min-h-0 flex-1 items-center justify-center py-4 sm:py-6">
        <div className="mx-auto w-full max-w-md">
          <Alert
            color="success"
            title="Check your email"
            description={`We sent a confirmation link to ${confirmationEmail}. Confirm your email to finish creating your account.`}
          />
          <TextLink to="/shop" className="mt-5 inline-block text-sm">
            Continue shopping
          </TextLink>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto py-4 sm:py-6">
      <div className="mx-auto w-full max-w-md">
        <h1 className="heading-xl">{title}</h1>
        <p className="mt-3 leading-relaxed text-secondary">
          {isSignUp
            ? 'Create an account to save pieces and keep your orders together.'
            : 'Welcome back. Sign in to view your orders and saved pieces.'}
        </p>

        {errorMessage && (
          <Alert
            color="danger"
            title={isSignUp ? 'Sign up failed' : 'Login failed'}
            description={errorMessage}
            className="mt-5"
          />
        )}

        <form key={mode} className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {isSignUp && (
            <label className="flex flex-col gap-2 text-sm">
              Name
              <Input
                name="name"
                autoComplete="name"
                size="lg"
                pill
                required
                aria-label="Name"
              />
            </label>
          )}
          <label className="flex flex-col gap-2 text-sm">
            Email
            <Input
              type="email"
              name="email"
              autoComplete="email"
              size="lg"
              pill
              required
              aria-label="Email"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Password
            <Input
              type="password"
              name="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              minLength={8}
              size="lg"
              pill
              required
              aria-label="Password"
            />
          </label>
          <Button
            type="submit"
            color="primary"
            size="lg"
            pill
            block
            loading={isSubmitting}
          >
            {title}
          </Button>
        </form>

        <p className="mt-5 text-sm text-secondary">
          {isSignUp ? 'Already have an account? ' : 'New to Ideating Labs? '}
          <TextLink to={alternatePath}>
            {isSignUp ? 'Login' : 'Sign Up'}
          </TextLink>
        </p>
        <TextLink to="/shop" className="mt-4 inline-block text-sm">
          Continue shopping
        </TextLink>
      </div>
    </main>
  )
}
