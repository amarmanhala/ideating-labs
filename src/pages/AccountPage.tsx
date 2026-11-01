import { Button } from '@openai/apps-sdk-ui/components/Button'
import { Input } from '@openai/apps-sdk-ui/components/Input'
import { TextLink } from '@openai/apps-sdk-ui/components/TextLink'
import { useNavigate } from 'react-router'
import { useAppDispatch } from '../app/hooks'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { signIn } from '../features/account/accountSlice'

export function AccountPage({ mode }: { mode: 'login' | 'signup' }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isSignUp = mode === 'signup'
  const title = isSignUp ? 'Sign Up' : 'Login'

  return (
    <div className="h-dvh overflow-hidden bg-surface text-primary">
      <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col px-5 py-3 sm:px-8 sm:py-4 lg:px-12">
        <SiteHeader />

        <main className="flex min-h-0 flex-1 items-center justify-center py-4 sm:py-6">
          <div className="mx-auto w-full max-w-md">
            <h1 className="heading-xl">{title}</h1>
            <p className="mt-3 leading-relaxed text-secondary">
              {isSignUp
                ? 'Create an account to save pieces and keep your orders together.'
                : 'Welcome back. Sign in to view your orders and saved pieces.'}
            </p>

            <form
              key={mode}
              className="mt-6 space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                const formData = new FormData(event.currentTarget)
                const email = String(formData.get('email') ?? '').trim()
                const providedName = String(formData.get('name') ?? '').trim()
                const fallbackName = email.split('@')[0] || 'Account'

                dispatch(
                  signIn({
                    name: providedName || fallbackName,
                    email,
                  }),
                )
                navigate('/')
              }}
            >
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
                  size="lg"
                  pill
                  required
                  aria-label="Password"
                />
              </label>
              <Button type="submit" color="primary" size="lg" pill block>
                {title}
              </Button>
            </form>

            <p className="mt-5 text-sm text-secondary">
              {isSignUp ? 'Already have an account? ' : 'New to Ideating Labs? '}
              <TextLink to={isSignUp ? '/login' : '/signup'}>
                {isSignUp ? 'Login' : 'Sign Up'}
              </TextLink>
            </p>
            <TextLink to="/shop" className="mt-4 inline-block text-sm">
              Continue shopping
            </TextLink>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}
