import { Button } from '@openai/apps-sdk-ui/components/Button'
import { TextLink } from '@openai/apps-sdk-ui/components/TextLink'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'

export function AccountPage({ mode }: { mode: 'login' | 'signup' }) {
  const isSignUp = mode === 'signup'
  const title = isSignUp ? 'Sign Up' : 'Login'
  const inputClassName =
    'mt-2 min-h-12 w-full rounded-md border border-default bg-surface px-4 py-3 text-primary'

  return (
    <div className="min-h-dvh bg-surface text-primary">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col px-5 py-3 sm:px-8 sm:py-4 lg:px-12">
        <SiteHeader />

        <main className="flex-1 py-12 sm:py-20">
          <div className="mx-auto w-full max-w-md">
            <h1 className="text-3xl">{title}</h1>
            <p id="account-availability" className="mt-4 leading-relaxed text-secondary">
              Account access is coming soon. You can keep browsing the collection
              while we get things ready.
            </p>

            <form
              key={mode}
              className="mt-8 space-y-5"
              aria-describedby="account-availability"
              onSubmit={(event) => event.preventDefault()}
            >
              {isSignUp && (
                <label className="block text-sm">
                  Name
                  <input name="name" autoComplete="name" className={inputClassName} />
                </label>
              )}
              <label className="block text-sm">
                Email
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  className={inputClassName}
                />
              </label>
              <label className="block text-sm">
                Password
                <input
                  type="password"
                  name="password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  className={inputClassName}
                />
              </label>
              <Button type="submit" color="primary" size="lg" block disabled>
                {title}
              </Button>
            </form>

            <p className="mt-6 text-sm text-secondary">
              {isSignUp ? 'Already have an account? ' : 'New to Ideating Labs? '}
              <TextLink to={isSignUp ? '/login' : '/signup'}>
                {isSignUp ? 'Login' : 'Sign Up'}
              </TextLink>
            </p>
            <TextLink to="/shop" className="mt-6 inline-block text-sm">
              Continue shopping
            </TextLink>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}
