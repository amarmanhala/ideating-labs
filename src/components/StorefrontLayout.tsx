import { Outlet, useLocation } from 'react-router'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function StorefrontLayout() {
  const { pathname } = useLocation()
  const showsFooter = pathname === '/'
  const usesViewportHeight =
    pathname === '/cart' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/auth/callback' ||
    pathname === '/orders' ||
    pathname === '/wishlist' ||
    /^\/shop\/[^/]+$/.test(pathname)

  if (showsFooter) {
    return (
      <div className="min-h-dvh bg-surface text-primary">
        <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-8 lg:px-12">
          <div className="flex h-dvh flex-col py-3 sm:py-4">
            <SiteHeader />
            <Outlet />
          </div>
          <SiteFooter />
        </div>
      </div>
    )
  }

  return (
    <div
      className={
        usesViewportHeight
          ? 'h-dvh overflow-hidden bg-surface text-primary'
          : 'min-h-dvh bg-surface text-primary'
      }
    >
      <div
        className={`mx-auto flex w-full max-w-[1600px] flex-col px-3 pb-3 pt-3 sm:px-8 sm:pb-4 sm:pt-4 lg:px-12 ${
          usesViewportHeight ? 'h-full' : 'min-h-dvh'
        }`}
      >
        <SiteHeader />
        <Outlet />
      </div>
    </div>
  )
}
